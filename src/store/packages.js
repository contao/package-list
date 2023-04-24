import details from './packages/details';

export default {
    namespaced: true,

    modules: {
        details,
    },

    actions: {
        async metadata({ dispatch }, data) {
            let metadata = await dispatch('algolia/getPackage', data.name, { root: true });

            if (metadata && metadata.versions) {
                delete metadata.versions;
            }

            return metadata;
        },
    },
};
