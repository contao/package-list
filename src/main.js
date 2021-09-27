import Vue from 'vue';
import VueResource from 'vue-resource';

import bootstrap from './bootstrap';
import router from './router';
import store from './store';
import i18n from './i18n';
import './filters';

import App from './components/App';

Vue.use(VueResource);

bootstrap(Vue, App, router, store, i18n);

const packagesCtx = require.context('../packages/', true, /\.(png|jpg|jpeg|gif|svg|webp)$/);
packagesCtx.keys().forEach(packagesCtx);

const newsCtx = require.context('../news/', true, /\.(png|jpg|jpeg|gif|svg|webp)$/);
newsCtx.keys().forEach(newsCtx);
