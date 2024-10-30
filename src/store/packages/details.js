let component = null;
let $vue = null;

export default {
    namespaced: true,

    mutations: {
        setCurrent(state, current) {
            $vue.$router.push({ query: Object.assign({}, $vue.$router.currentRoute.value.query, { p: current }), append: true });
        },

        clearCurrent() {
            const query = Object.assign({}, $vue.$router.currentRoute.value.query);
            delete query.p;
            $vue.$router.push({ query, append: true });
        },

        trackPackage(state, packageName) {
            if (!packageName) {
                $vue.$store.commit('modals/close', 'package-details');
                return;
            }

            $vue.$store.commit('modals/open', { id: 'package-details', component })
        },
    },

    actions: {
        init({ commit }, { vue, component: newComp }) {
            $vue = vue;
            component = newComp;
            $vue.$watch('$route.query.p', p => commit('trackPackage', p));
            commit('trackPackage', $vue.$route.query.p);
        },
    },
};
