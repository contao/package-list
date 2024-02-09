import Vue from 'vue';
import Router from 'vue-router';
import DiscoverRoute from '../components/routes/DiscoverRoute';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: DiscoverRoute,
            props: true,
        },
        { path: '*', redirect: '/' },
    ],
});

export default router;
