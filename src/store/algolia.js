import { Http } from 'vue-resource';
import algoliasearch from 'algoliasearch';

const client = algoliasearch('60DW2LJW0P', '13718a23f4e436f7e7614340bd87d913');
const indexes = {};

const algolia = (name = 'v3_packages') => {
    if (!indexes[name]) {
        indexes[name] = client.initIndex(name);
    }

    return indexes[name];
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
        }
    },

    actions: {
        async getPackage({ state, commit }, name) {
            if (!name || !name.includes('/')) {
                return null;
            }

            if (Object.keys(state.metadata).includes(name)) {
                return state.metadata[name];
            }

            let data = null;

            try {
                data = (await Http.get(`https://packagist.org/packages/${name}.json`)).data.package;
                data.downloads = data.downloads.total;

                const latest = Object.keys(data.versions).reduce((prev, curr) => {
                    if (prev === undefined) {
                        return curr;
                    }

                    if (curr.substr(0, 4) === 'dev-' && prev.substr(0, 4) !== 'dev-') {
                        return prev;
                    }

                    if (prev.substr(0, 4) === 'dev-' && curr.substr(0, 4) !== 'dev-') {
                        return curr;
                    }

                    return new Date(data.versions[prev].time) > new Date(data.versions[curr].time) ? prev : curr;
                });

                data = Object.assign(data, data.versions[latest]);
                data.latest = { version: latest, time: data.versions[latest].time };
            } catch (err) {
                // Ignore
            }

            try {
                const content = await algolia().search({
                    filters: `name:"${name}" AND languages:${state.language}`,
                    hitsPerPage: 1,
                });

                data = Object.assign(data || {}, content.hits[0]);
            } catch (err) {
                return null;
            }

            if (!data) {
                return null;
            }

            delete data.version;
            delete data.time;
            delete data.constraint;

            commit('cache', { name, data: data });

            return data;
        },

        async findPackages({ state }, params) {
            let suffix = '';

            if (params.hasOwnProperty('sorting')) {
                suffix = params.sorting ? `_${params.sorting}` : '';
                delete params.sorting;
            }

            params.filters = `languages:${state.language}`;

            return await algolia(`v3_packages${suffix}`).search(params);
        },

        async discover({ state, commit }) {
            try {
                const content = await client.search([
                    {
                        indexName: 'v3_packages',
                        params: {
                            hitsPerPage: 6,
                            filters: `languages:${state.language}`,
                        },
                    },
                    {
                        indexName: 'v3_ads',
                        params: {
                            hitsPerPage: 6,
                            filters: `languages:${state.language}`,
                        },
                    },
                ]);

                const items = Array.from(content.results[1].hits);
                const ads = [];

                // Randomly sort ads
                while(items.length > 0) {
                    let ri = Math.floor(Math.random() * items.length);
                    ads.push(items[ri]);
                    items.splice(ri, 1);
                }

                commit('setDiscover', {
                    updated: content.results[0].hits,
                    ads,
                });

            } catch (err) {
                commit('setDiscover', null);
                throw err;
            }
        },
    },
};
