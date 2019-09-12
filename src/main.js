import Vue from 'vue';
import VueResource from 'vue-resource';

import router from './router';
import store from './store';
import i18n from './i18n';

import App from './components/App';

Vue.use(VueResource);

i18n.init().then(() => {
    /* eslint-disable no-new */
    new Vue({
        router,
        store,
        render: h => h(App),
    }).$mount('#app');
});
