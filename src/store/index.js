import { createStore } from 'vuex';
import gameModule from './modules/game/game.js';

const store = createStore({
  modules: {
    gam: gameModule
  },

  state() {
    return {
      user: null,
      token: null
    };
  },

  mutations: {
    addUser(state, payload) {
      state.user = payload;
    },
    addUserToken(state, payload) {
      state.token = payload;
    }
  },

  actions: {
    autoLogin(context) {
      const uuid = sessionStorage.getItem('user');

      if (uuid) {
        context.commit('addUser', { uuid: uuid });
      }
    },
    setUser(context, user) {
      sessionStorage.setItem('user', user.uuid);
      context.commit('addUser', user);
    },
    setUserToken(context, token) {
      context.commit('addUserToken', token);
    }
  },

  getters: {
    getUser(state) {
      return state.user;
    },
    getUserToken(state) {
      return state.token;
    }
  }
});

export default store;
