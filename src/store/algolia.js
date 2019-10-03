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

const overrides = {
    'contao/manager-bundle': {
        features: {
            'contao/news-bundle': 'manage news entries in Contao.',
            'contao/calendar-bundle': 'manage upcoming and past events in Contao.',
            'contao/faq-bundle': 'manage questions and respective answers in Contao.',
            'contao/comments-bundle': 'enhances Contao with general comments functionality.',
            'contao/newsletter-bundle': 'manage newsletters and recipient lists and send them from the Contao back end.',
            'contao/listing-bundle': 'a front end module that can list entries of an arbitrary database table with a customizable template.',
        },
    },
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

                    if ((curr.substr(0, 4) === 'dev-' || curr.substr(-4) === '-dev')
                        && prev.substr(0, 4) !== 'dev-' && prev.substr(-4) !== '-dev') {
                        return prev;
                    }

                    if ((prev.substr(0, 4) === 'dev-' || prev.substr(-4) === '-dev')
                        && curr.substr(0, 4) !== 'dev-' && curr.substr(-4) !== '-dev') {
                        return curr;
                    }

                    return new Date(data.versions[prev].time) > new Date(data.versions[curr].time) ? prev : curr;
                });

                data = Object.assign(data, data.versions[latest]);
                data.latest = { version: latest, time: data.versions[latest].time };
            } catch (err) {
                // ignore
            }

            try {
                const content = await algolia().search({
                    filters: `name:"${name}" AND languages:${state.language}`,
                    hitsPerPage: 1,
                });

                data = Object.assign(data || {}, { supported: true }, content.hits[0]);
            } catch (err) {
                // ignore
            }

            if (overrides[name]) {
                data = Object.assign(data || {}, overrides[name]);
            }

            if (!data) {
                return null;
            }

            delete data.versions;
            delete data.version;
            delete data.time;
            delete data.constraint;

            commit('cache', { name, data: data });

            if (data.features) {
                commit('packages/pushFeatures', { [name]: Object.keys(data.features) }, { root: true });
            }

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
                const today = `${d.getFullYear()}${d.getMonth()+1}${d.getDay()}`;
                const content = await client.search([
                    {
                        indexName: 'v3_packages_latest',
                        params: {
                            hitsPerPage: 6,
                            filters: `languages:${state.language} AND dependency:false`,
                        },
                    },
                    {
                        indexName: 'v3_ads',
                        params: {
                            hitsPerPage: 6,
                            filters: `languages:${state.language} AND validFrom<=${today} AND validTo>=${today}`,
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
            }
        },
    },
};
