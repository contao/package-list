import Vue from 'vue';
import Router from 'vue-router';
import Discover from '../components/routes/Discover';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Discover,
            props: true,
        },
        { path: '*', redirect: '/' },
    ],
});

export default router;
