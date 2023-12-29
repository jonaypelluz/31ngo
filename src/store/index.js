import { createStore } from 'vuex';
import gameModule from './modules/game/game';

const getDefaultState = () => {
    return {
        user: {
            uuid: null,
            hash: null,
            numbers: [],
            bingoCard: [],
        },
        token: null,
    };
};

const updateUserInSessionStorage = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
};

const store = createStore({
    modules: {
        gam: gameModule,
    },

    state: getDefaultState,

    mutations: {
        addUser(state, newUser) {
            state.user = { ...state.user, ...newUser };
            updateUserInSessionStorage(state.user);
        },
        addUserToken(state, token) {
            state.token = token;
        },
        updateUserUUID(state, uuid) {
            state.user.uuid = uuid;
            updateUserInSessionStorage(state.user);
        },
        resetState(state) {
            Object.assign(state, getDefaultState());
            sessionStorage.removeItem('user');
        },
    },

    actions: {
        autoLogin({ commit }) {
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (user) {
                commit('addUser', user);
            }
        },
        setUser({ commit }, user) {
            commit('addUser', user);
        },
        setUserUUID({ commit }, uuid) {
            commit('updateUserUUID', uuid);
        },
        setUserToken(context, token) {
            context.commit('addUserToken', token);
        },
        resetUserState(context) {
            context.commit('resetState');
        },
    },

    getters: {
        getUser(state) {
            return state.user;
        },
        getUserToken(state) {
            return state.token;
        },
    },
});

export default store;
