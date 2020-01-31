/* eslint-disable no-param-reassign */

import details from './packages/details';

export default {
    namespaced: true,

    modules: {
        details,
    },

    actions: {
        async metadata({ dispatch }, name) {
            return dispatch('algolia/getPackage', name, { root: true });
        },
    },
};
