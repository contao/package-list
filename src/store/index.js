/* eslint-disable no-param-reassign */

import { createStore } from 'vuex'
import algolia from './algolia';
import modals from './modals';
import packages from './packages';

const store = createStore({
    modules: { algolia, modals, packages },
});

export default store;
