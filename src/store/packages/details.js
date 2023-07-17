let component = null;
let $vue = null;

const findStatePosition = function(keys) {
    if (!window.history.state || !window.history.state.key) {
        return -1;
    }

    return keys.lastIndexOf(window.history.state.key)
};

export default {
    namespaced: true,

    state: {
        current: null,
        keys: [],
        packages: [],
    },

    getters: {
        hasPrevious(state) {
            // eslint-disable-next-line
            const current = state.current;
            const position = findStatePosition(state.keys);

            return position > 0;
        },
    },

    mutations: {
        setCurrent(state, current) {
            $vue.$router.push({ query: Object.assign({}, $vue.$router.currentRoute.query, { p: current }), append: true });
        },

        clearCurrent() {
            const query = Object.assign({}, $vue.$router.currentRoute.query);
            delete query.p;
            $vue.$router.push({ query, append: true });
        },

        popCurrent(state) {
            if (state.packages.length > 1) {
                $vue.$router.go(-1);
            }
        },

        trackPackage(state, packageName) {
            if (!packageName) {
                $vue.$store.commit('modals/close', 'package-details');
                state.current = null;
                state.keys = [];
                state.packages = [];
                return;
            }

            state.current = packageName;

            const position = findStatePosition(state.keys);
            if (position !== -1) {
                if (state.packages[position] === packageName) {
                    return;
                }

                state.keys = [];
                state.packages = [];
            }

            state.keys.push(history.state && history.state.key || '');
            state.packages.push(packageName);

            if (state.packages.length === 1) {
                $vue.$store.commit('modals/open', { id: 'package-details', component })
            }
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
