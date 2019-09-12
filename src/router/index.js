import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            // component: PackagesSearch,
            props: true,
        },
        { path: '*', redirect: '/' },
    ],
});

export default router;
