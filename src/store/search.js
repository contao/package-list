import axios from 'axios';
import { coerce, compare } from 'semver';
import features from './packages/features';

const randomizeHits = (hits, limit = 6) => {
    const items = Array.from(hits);
    const result = [];

    // Randomly sort hits
    while(items.length > 0 && result.length < limit) {
        let ri = Math.floor(Math.random() * items.length);
        result.push(items[ri]);
        items.splice(ri, 1);
    }

    return result;
};

const getApi = async (language, path, params) => {
    const host = location.hostname === 'localhost' ? 'http://localhost:8001' : 'https://extensions.contao.org';

    if (params) {
        path = `${path}?${new URLSearchParams(params).toString()}`
    }

    return await axios.get(`${host}/api.php/${path}`, {
        headers: {
            'Accept': 'application/json',
            'Accept-Language': language,
        }
    });
}

export default {
    namespaced: true,

    state: {
        language: 'en',
        metadata: {},
        discover: null,
        ads: [],
        news: [],
    },

    mutations: {
        setLanguage(state, language) {
            state.language = language;
            state.metadata = {};
        },

        cache(state, { name, data }) {
            state.metadata[name] = data;
        },

        uncache(state, name) {
            delete state.metadata[name];
        },

        reset(state) {
            state.metadata = {};
        },

        setDiscover(state, data) {
            state.discover = data;

            state.ads = data ? data.ads : [];
            state.news = data ? data.news : [];
        },
    },

    actions: {
        getPackage({ state, commit }, name) {
            if (!name || !name.includes('/')) {
                return new Promise(resolve => resolve(null));
            }

            if (Object.keys(state.metadata).includes(name)) {
                return state.metadata[name];
            }

            const data = (async () => {
                let data = null;

                try {
                    const response = await getApi(state.language, `p/${name}`);

                    if (response.status === 200) {
                        data = response.data;
                    }
                } catch (err) {
                    // ignore
                }

                try {
                    if (data && data.private) {
                        data = Object.assign({}, (await axios.get(`https://contao.github.io/package-metadata/meta/${name}/composer.json`)).data, data || {});
                    } else {
                        let pkg = (await axios.get(`https://packagist.org/packages/${ name }.json`)).data.package;
                        let versionsData = [];
                        let versions;

                        pkg.downloads = pkg.downloads.total;
                        pkg.dependency = true;

                        try {
                            const versions = (await axios.get(`https://repo.packagist.org/p2/${ name }.json`)).data.packages[name];

                            // Data is minified in Composer 2, see https://github.com/composer/metadata-minifier/
                            let expandedVersion = null;
                            Object.values(versions).forEach((versionData) => {
                                if (!expandedVersion) {
                                    expandedVersion = versionData;
                                    versionsData.push(JSON.parse(JSON.stringify(expandedVersion)));
                                    return;
                                }

                                // add any changes from the previous version to the expanded one
                                Object.keys(versionData).forEach((key) => {
                                    if (versionData[key] === '__unset') {
                                        delete expandedVersion[key];
                                    } else {
                                        expandedVersion[key] = versionData[key];
                                    }
                                });

                                versionsData.push(JSON.parse(JSON.stringify(expandedVersion)));
                            });
                        } catch (err) {
                            versionsData = Object.values(pkg.versions);
                        }

                        versions = versionsData.filter(
                            pkg => pkg.version.substr(0, 4) !== 'dev-' && pkg.version.substr(-4) !== '-dev' && pkg.require && 'contao/core-bundle' in pkg.require,
                        );

                        if (!versions.length) {
                            versions = versionsData.filter(
                                pkg => pkg.version.substr(0, 4) !== 'dev-' && pkg.version.substr(-4) !== '-dev',
                            );
                        }

                        if (!versions.length) {
                            versions = versionsData;
                        }

                        if (!versions || !versions.length) {
                            versions = [];
                        }

                        versions = versions.sort(
                            (a, b) => {
                                const v1 = coerce(a.version_normalized, { loose: true });
                                const v2 = coerce(b.version_normalized, { loose: true });

                                const result = compare(v1, v2);

                                if (result === 0) {
                                    return new Date(a.time) > new Date(b.time) ? 1 : -1;
                                }

                                return result;
                            },
                        );

                        if (versions.length) {
                            const latest = versions[versions.length - 1];

                            pkg = Object.assign(pkg, latest);
                            pkg.latest = { version: latest.version, time: latest.time };
                        }

                        data = Object.assign({}, pkg, data || {}, { versions });
                    }
                } catch (err) {
                    // eslint-disable-next-line
                    console.info('No package metadata for '+name, err);
                }

                if (!data) {
                    return null;
                }

                delete data.version;
                delete data.time;
                delete data.constraint;

                if (features[data.name]) {
                    data.features = features[data.name];
                }

                return data;
            })();

            commit('cache', { name, data });

            return data;
        },

        async findPackages({ state, dispatch }, params) {
            if (params.sorting) {
                const sorting = params.sorting;
                delete params.sorting;

                return (await getApi(state.language, `discover/${sorting}`, params)).data
            }

            const response = (await getApi(state.language, 'search', params)).data

            if (
                params.query
                && new RegExp('^[a-z0-9]([_.-]?[a-z0-9]+)*/[a-z0-9](([_.]|-{1,2})?[a-z0-9]+)*$').test(params.query)
                && !response.hits.find((p) => p.name === params.query)
            ) {
                const pkg = await dispatch('getPackage', params.query);

                if (pkg) {
                    // Allow to install package if found by exact name
                    pkg.dependency = false;

                    response.totalHits++;
                    response.hits.push(pkg);
                }
            }

            return response;
        },

        async discover({ state, commit }) {
            try {
                const content = (await getApi(state.language, 'discover')).data;

                commit('setDiscover', {
                    total: content.total,
                    latest: content.latest,
                    downloads: content.downloads,
                    favers: content.favers,
                    ads: randomizeHits(content.ads.primary).concat(randomizeHits(content.ads.secondary, 6 - content.ads.primary.length)),
                    news: randomizeHits(content.ads.subheader),
                });

            } catch (err) {
                commit('setDiscover', null);
            }
        },
    },
};
