import { Http } from 'vue-resource';
import algoliasearch from 'algoliasearch';
import semver from 'semver';

const client = algoliasearch('60DW2LJW0P', '13718a23f4e436f7e7614340bd87d913');
const indexes = {};

const algolia = (name = 'v3_packages') => {
    if (!indexes[name]) {
        indexes[name] = client.initIndex(name);
    }

    return indexes[name];
};

const randomizeAds = (hits, limit = 6) => {
    const items = Array.from(hits);
    const ads = [];

    // Randomly sort ads
    while(items.length > 0 && ads.length < limit) {
        let ri = Math.floor(Math.random() * items.length);
        ads.push(items[ri]);
        items.splice(ri, 1);
    }

    return ads;
};

export default {
    namespaced: true,

    state: {
        language: 'en',
        metadata: {},
        discover: null,
        ads: [],
    },

    mutations: {
        setLanguage(state, language) {
            state.language = language;
            state.metadata = {};
        },

        cache(state, { name, data }) {
            state.metadata[name] = data;
        },

        reset(state) {
            state.metadata = {};
        },

        setDiscover(state, data) {
            state.discover = data;

            state.ads = data ? data.ads : [];
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

            const data = new Promise(async (resolve) => {
                let data = null;

                try {
                    const content = await algolia().search({
                        filters: `name:"${name}" AND languages:${state.language}`,
                        hitsPerPage: 1,
                    });

                    if (content.nbHits > 0) {
                        data = content.hits[0];
                    }
                } catch (err) {
                    // ignore
                }

                try {
                    if (data && data.private) {
                        data = Object.assign({}, (await Http.get(`https://contao.github.io/package-metadata/meta/${name}/composer.json`)).data, data || {});
                    } else {
                        let pkg = (await Http.get(`https://packagist.org/packages/${name}.json`)).data.package;
                        let versions;

                        // noinspection JSPrimitiveTypeWrapperUsage
                        pkg.downloads = pkg.downloads.total;
                        // noinspection JSPrimitiveTypeWrapperUsage
                        pkg.dependency = true;

                        try {
                            versions = (await Http.get(`https://repo.packagist.org/p/${name}.json`)).data.packages[name];
                        } catch (err) {
                            versions = pkg.versions;
                        }

                        let latest = Object.values(versions).filter(
                            pkg => pkg.version.substr(0, 4) !== 'dev-' && pkg.version.substr(-4) !== '-dev' && pkg.require && 'contao/core-bundle' in pkg.require,
                        );

                        if (!latest.length) {
                            latest = Object.values(versions).filter(
                                pkg => pkg.version.substr(0, 4) !== 'dev-' && pkg.version.substr(-4) !== '-dev',
                            );
                        }

                        if (!latest.length) {
                            latest = Object.values(versions);
                        }

                        latest = latest.sort(
                            (a, b) => {
                                const v1 = semver.coerce(a.version_normalized, { loose: true });
                                const v2 = semver.coerce(b.version_normalized, { loose: true });

                                const result = semver.compare(v1, v2);

                                if (result === 0) {
                                    return new Date(a.time) > new Date(b.time) ? 1 : -1;
                                }

                                return result;
                            },
                        ).pop();

                        pkg = Object.assign(pkg, latest);
                        pkg.latest = { version: latest.version, time: latest.time };

                        data = Object.assign({}, pkg, data || {});
                    }
                } catch (err) {
                    console.error('Error fetching metadata for '+name, err);
                }

                if (!data) {
                    resolve(null);
                    return;
                }

                delete data.versions;
                delete data.version;
                delete data.time;
                delete data.constraint;

                resolve(data);
            });

            commit('cache', { name, data });

            return data;
        },

        async findPackages({ state }, params) {
            let suffix = '';

            if (params.hasOwnProperty('sorting')) {
                suffix = params.sorting ? `_${params.sorting}` : '';
                delete params.sorting;
            }

            params.filters = `languages:${state.language} AND dependency:false`;

            return await algolia(`v3_packages${suffix}`).search(params);
        },

        async discover({ state, commit }) {
            try {
                const d = new Date();
                const today = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2, '0')}${String(d.getDay()).padStart(2, '0')}`;
                const content = await client.search([
                    {
                        indexName: 'v3_packages_latest',
                        params: {
                            hitsPerPage: 6,
                            filters: `languages:${state.language} AND dependency:false`,
                        },
                    },
                    {
                        indexName: 'v3_packages_downloads',
                        params: {
                            hitsPerPage: 4,
                            filters: `languages:${state.language} AND dependency:false`,
                        },
                    },
                    {
                        indexName: 'v3_packages_favers',
                        params: {
                            hitsPerPage: 4,
                            filters: `languages:${state.language} AND dependency:false`,
                        },
                    },
                    {
                        indexName: 'v3_ads',
                        params: {
                            hitsPerPage: 6,
                            filters: `primary:true AND languages:${state.language} AND published:true AND validFrom <= ${today} AND validTo >= ${today}`,
                        },
                    },
                    {
                        indexName: 'v3_ads',
                        params: {
                            hitsPerPage: 100,
                            filters: `primary:false AND languages:${state.language} AND published:true AND validFrom <= ${today} AND validTo >= ${today}`,
                        },
                    },
                ]);

                commit('setDiscover', {
                    latest: content.results[0].hits,
                    downloads: content.results[1].hits,
                    favers: content.results[2].hits,
                    ads: randomizeAds(Array.from(content.results[3].hits).concat(randomizeAds(content.results[4].hits, 6 - content.results[3].nbHits))),
                });

            } catch (err) {
                commit('setDiscover', null);
            }
        },
    },
};
