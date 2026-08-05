import { createStore } from 'vuex'
import search from './search';
import modals from './modals';
import packages from './packages';

const store = createStore({
    modules: { search, modals, packages },
});

export default store;
