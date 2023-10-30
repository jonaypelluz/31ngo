import { auth } from '@/services/firebase/firebase';
import { signInAnonymously } from 'firebase/auth';
import { createRouter, createWebHistory } from 'vue-router';
import GameHost from './pages/GameHost.vue';
import GamePlayer from './pages/GamePlayer.vue';
import Home from './pages/Home.vue';
import Host from './pages/Host.vue';
import NotFound from './pages/NotFound.vue';
import Player from './pages/Player.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home, meta: { hideHeader: true } },
        { path: '/host', name: 'host', component: Host, meta: { needsUuid: true } },
        {
            path: '/player',
            name: 'player',
            component: Player,
            meta: { needsUuid: true },
        },
        {
            path: '/games/player/:id',
            name: 'gameplayer',
            component: GamePlayer,
            props: true,
            meta: { needsUuid: true },
        },
        {
            path: '/games/host/:id',
            name: 'gamehost',
            component: GameHost,
            props: true,
            meta: { needsUuid: true },
        },
        { path: '/game-not-found', component: NotFound, meta: { type: 'game' } },
        { path: '/:notFound(.*)', component: NotFound },
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

router.beforeEach(async (to, from, next) => {
    let userToken = sessionStorage.getItem('userToken');
    if (!userToken) {
        await signInAnonymously(auth);
    }
    auth.onAuthStateChanged((user) => {
        if (!user) {
            //TODO: fix 400 error when account is deleted from firebase
            sessionStorage.removeItem('userToken');
        } else {
            user.getIdToken().then((token) => {
                sessionStorage.setItem('userToken', token);
            });
        }
    });

    if (to.meta.needsUuid) {
        const uuid = sessionStorage.getItem('user');
        if (!uuid) {
            next('/');
        }
    }

    next();
});

export default router;
