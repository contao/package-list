import Vue from 'vue';
import Router from 'vue-router';

import PackagesSearch from '../components/routes/PackageSearch';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            component: PackagesSearch,
            props: true,
        },
        { path: '*', redirect: '/' },
    ],
});

export default router;
