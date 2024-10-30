import { createRouter, createWebHistory } from 'vue-router'
import DiscoverRoute from '../components/routes/DiscoverRoute';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: DiscoverRoute,
        },
        { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
});

export default router;
