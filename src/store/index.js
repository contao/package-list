/* eslint-disable no-param-reassign */

import Vue from 'vue';
import Vuex from 'vuex';

import packages from './packages';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: { packages },
});

export default store;
