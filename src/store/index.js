/* eslint-disable no-param-reassign */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import algolia from './algolia';
import modals from './modals';
import packages from './packages';

const store = new Vuex.Store({
    modules: { algolia, modals, packages },
});

export default store;
