import { auth } from '@/services/firebase/firebase';
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
      meta: { needsUuid: true }
    },
    {
      path: '/games/player/:id',
      name: 'gameplayer',
      component: GamePlayer,
      props: true,
      meta: { needsUuid: true }
    },
    {
      path: '/games/host/:id',
      name: 'gamehost',
      component: GameHost,
      props: true,
      meta: { needsUuid: true }
    },
    { path: '/game-not-found', component: NotFound, meta: { type: 'game' } },
    { path: '/:notFound(.*)', component: NotFound }
  ],
  scrollBehavior(_, _2, savedPosition) {
    return savedPosition
      ? savedPosition
      : {
          left: 0,
          top: 0
        };
  }
});

router.beforeEach(async (to, from, next) => {
  //firebase
  let userToken = sessionStorage.getItem('userToken');
  if (!userToken) {
    await auth.signInAnonymously();
  }
  auth.onAuthStateChanged(user => {
    user.getIdToken().then(token => {
      sessionStorage.setItem('userToken', token);
    });
  });

  //uuid
  if (to.meta.needsUuid) {
    const uuid = sessionStorage.getItem('user');
    if (!uuid) {
      next('/');
    }
  }

  next();
});

export default router;

/**
 * Router.beforeEach((to, from, next) => {

  // If route required authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {

    // Load user
    auth.onAuthStateChanged(user => {

      // If user obj does not exist --> redirect to login page
      if (!user) {
        next({ name: 'login' });
      } else {
        store.commit("user/SET_USER", user);
        user.getIdToken().then(token => {
          store.commit("user/SET_TOKEN", token)
        });

        next();
      }
    });
  } else {

    // Path does not required auth - Still we check the user
    firebase.auth().onAuthStateChanged(user => {

      // If user exist (is logged in) --> store in state.
      if (user) {  
        store.commit("user/SET_USER", user);
        user.getIdToken().then(token => {
          store.commit("user/SET_TOKEN", token)
        });
        next();

      } else {
        next();
      }
    });
  }
})
 */
