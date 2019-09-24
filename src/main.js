import Vue from 'vue';
import VueResource from 'vue-resource';

import router from './router';
import store from './store';
import i18n from './i18n';
import './filters';

import App from './components/App';

Vue.use(VueResource);

i18n.init().then(() => {
    /* eslint-disable no-new */
    const $vue = new Vue({
        router,
        store,
        render: h => h(App),
    });

    $vue.$store.commit('packages/details/setRouter', router);

    $vue.$mount('#app');
});
