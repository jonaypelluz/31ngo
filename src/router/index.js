import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            name: 'home',
            path: '/',
            component: () => import('../pages/Home.vue'),
            meta: { hideHeader: true },
        },
        {
            name: 'host',
            path: '/host',
            component: () => import('../pages/Host.vue'),
            meta: { needsUuid: true },
        },
        {
            name: 'player',
            path: '/player',
            component: () => import('../pages/Player.vue'),
            meta: { needsUuid: true },
        },
        {
            name: 'gameplayer',
            path: '/games/player/:id',
            component: () => import('../pages/GamePlayer.vue'),
            props: true,
            meta: { needsUuid: true },
        },
        {
            name: 'gamehost',
            path: '/games/host/:id',
            component: () => import('../pages/GameHost.vue'),
            props: true,
            meta: { needsUuid: true },
        },
        {
            path: '/game-not-found',
            component: () => import('../pages/NotFound.vue'),
            meta: { type: 'game' },
        },
        {
            path: '/:notFound(.*)',
            component: () => import('../pages/NotFound.vue'),
        },
    ],
    scrollBehavior(_, _2, savedPosition) {
        return savedPosition
            ? savedPosition
            : {
                  left: 0,
                  top: 0,
              };
    },
});

router.beforeEach(async (to, _, next) => {
    if (to.meta.needsUuid) {
        const user = sessionStorage.getItem('user');
        if (!user) {
            next('/');
        }
    }

    next();
});

export default router;
