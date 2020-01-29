export default {
    namespaced: true,

    state: {
        router: null,
        current: null,
        previous: [],
    },

    getters: {
        hasPrevious: state => state.previous.length > 0,
    },

    mutations: {
        setCurrent(state, current) {
            const previous = state.router.currentRoute.query.p;

            if (previous) {
                state.previous.push(previous);
            }

            state.router.push({ query: Object.assign({}, state.router.currentRoute.query, { p: current }), append: true });
        },

        clearCurrent(state) {
            state.previous = [];

            const query = Object.assign({}, state.router.currentRoute.query);
            delete query.p;
            state.router.push({ query, append: true });
        },

        popCurrent(state) {
            state.previous.pop();
            state.router.go(-1);
        },

        setRouter(state, router) {
            state.router = router;
        },
    },
};
