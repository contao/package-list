import axios from 'axios';
import { liteClient } from 'algoliasearch/lite';
import { coerce, compare } from 'semver';
import features from './packages/features';

const client = liteClient('60DW2LJW0P', '13718a23f4e436f7e7614340bd87d913');

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
                    const content = await client.search([{
                        indexName: 'v3_packages',
                        params: {
                            filters: `name:"${ name }" AND languages:${ state.language }`,
                            hitsPerPage: 1,
                        },
                    }]);

                    if (content.results[0].nbHits > 0) {
                        data = content.results[0].hits[0];
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

                        // noinspection JSPrimitiveTypeWrapperUsage
                        pkg.downloads = pkg.downloads.total;
                        // noinspection JSPrimitiveTypeWrapperUsage
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
            let suffix = '';
            let filter = 'dependency:false';

            if (params.sorting) {
                suffix = params.sorting ? `_${params.sorting}` : '';
                filter = 'discoverable:true';
                delete params.sorting;
            }

            if (params.type) {
                filter = `type:${params.type}`;
                delete params.type;
            }

            params.filters = `languages:${state.language} AND ${filter}`;
            params.highlightPreTag = '%%';
            params.highlightPostTag = '%%';

            const response = (await client.search([{
                indexName: `v3_packages${suffix}`,
                params,
            }])).results[0];

            if (
                params.query
                && new RegExp('^[a-z0-9]([_.-]?[a-z0-9]+)*/[a-z0-9](([_.]|-{1,2})?[a-z0-9]+)*$').test(params.query)
                && !response.hits.find((p) => p.name === params.query)
            ) {
                const pkg = await dispatch('getPackage', params.query);

                if (pkg) {
                    response.nbHits++;
                    response.hits.push(pkg);
                }
            }

            return response;
        },

        async discover({ state, commit }) {
            try {
                const d = new Date();
                const today = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
                const content = await client.search([
                    {
                        indexName: 'v3_packages_latest',
                        params: {
                            hitsPerPage: 6,
                            filters: `languages:${state.language} AND discoverable:true`,
                        },
                    },
                    {
                        indexName: 'v3_packages_downloads',
                        params: {
                            hitsPerPage: 4,
                            filters: `languages:${state.language} AND discoverable:true`,
                        },
                    },
                    {
                        indexName: 'v3_packages_favers',
                        params: {
                            hitsPerPage: 4,
                            filters: `languages:${state.language} AND discoverable:true`,
                        },
                    },
                    {
                        indexName: 'v3_ads',
                        params: {
                            hitsPerPage: 6,
                            filters: `position:primary AND languages:${state.language} AND published:true AND validFrom <= ${today} AND validTo >= ${today}`,
                        },
                    },
                    {
                        indexName: 'v3_ads',
                        params: {
                            hitsPerPage: 100,
                            filters: `position:secondary AND languages:${state.language} AND published:true AND validFrom <= ${today} AND validTo >= ${today}`,
                        },
                    },
                    {
                        indexName: 'v3_ads',
                        params: {
                            hitsPerPage: 100,
                            filters: `position:subheader AND languages:${state.language} AND published:true AND validFrom <= ${today} AND validTo >= ${today}`,
                        },
                    },
                ]);

                commit('setDiscover', {
                    latest: content.results[0].hits,
                    downloads: content.results[1].hits,
                    favers: content.results[2].hits,
                    ads: randomizeHits(content.results[3].hits).concat(randomizeHits(content.results[4].hits, 6 - content.results[3].nbHits)),
                    news: randomizeHits(content.results[5].hits),
                });

            } catch (err) {
                commit('setDiscover', null);
            }
        },
    },
};
