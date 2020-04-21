export default {
    namespaced: true,

    state: {
        modals: {},
    },

    getters: {
        hasModal: state => Object.values(state.modals).reduce((accu, modals) => (accu + Object.values(modals).length), 0) > 0,

        currentModal(state) {
            const prios = Object.keys(state.modals).sort((a, b) => (a - b));

            for (const prio of prios) {
                const modals = Object.values(state.modals[prio]);
                if (modals.length > 0) {
                    return modals.find(() => true);
                }
            }
        },
    },

    mutations: {
        open(state, { id, component, priority = 0 }) {
            const modals = Object.assign({}, state.modals);

            if (!modals[priority]) {
                modals[priority] = {};
            }

            modals[priority][id] = component;

            state.modals = modals;
        },

        close(state, id) {
            const modals = Object.assign({}, state.modals);

            Object.keys(modals).forEach((priority) => {
                if (modals[priority] && modals[priority][id]) {
                    delete modals[priority][id];
                }
            });

            state.modals = modals;
        },
    },
};
