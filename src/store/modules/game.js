import gameApi from '@/services/api/game.js';

const getDefaultState = () => {
  return {
    game: {
      hash: null,
      host: null,
      hasStarted: false,
      hasFinished: false,
      drawNumber: null,
      drawnNumbers: [],
      winners: [],
      players: {},
      maxPlayers: null
    }
  };
};

// initial state
const state = getDefaultState();

const getters = {
  getGame(state) {
    return state.game;
  },
  getPlayers(state) {
    return state.game.players;
  },
  getMaxPlayers(state) {
    return state.game.maxPlayers;
  },
  getDrawnNumbers(state) {
    return state.game.drawnNumbers;
  },
  getDrawNumber(state) {
    return state.game.drawNumber;
  },
  getWinners(state) {
    return state.game.winners ?? [];
  },
  hasGameStarted(state) {
    return state.game.hasStarted;
  },
  hasGameFinished(state) {
    return state.game.hasFinished;
  }
};

const mutations = {
  updateGame(state, payload) {
    state.game = payload;
  },
  updatePlayers(state, payload) {
    state.game.players = payload;
  },
  updateDrawNumber(state, payload) {
    state.game.drawNumber = payload;
  },
  updateDrawnNumbers(state, payload) {
    state.game.drawnNumbers = payload;
  },
  updateHasStarted(state, payload) {
    state.game.hasStarted = payload;
  },
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
  updateWinners(state, payload) {
    state.game.winners = payload;
  }
};

const actions = {
  async getGame(context, gameId) {
    const data = await gameApi.fetchGame(gameId);
    const game = context.getters.getGame;

    const gameData = {
      ...game,
      ...data
    };
    context.commit('updateGame', gameData);
    return context.getters.getGame;
  },
  async createGame(context, data) {
    const defaultGame = getDefaultState();
    const gameData = {
      ...defaultGame.game,
      ...data
    };

    await gameApi.createGame(gameData);
    await gameApi.addGameToUser(gameData);
    context.commit('updateGame', gameData);
  },
  async addDrawNumber(context, num) {
    const game = context.getters.getGame;
    await gameApi.addDrawnNumbers(game);
    context.commit('updateDrawNumber', num);
  },
  async hasStarted(context, gameId) {
    await gameApi.hasStarted(gameId);
    context.commit('updateHasStarted', true);
  },
  async hasFinished(context, gameId) {
    await gameApi.hasFinished(gameId);
    context.commit('resetState');
  },
  async addUserInfo(context, userData) {
    const user = context.rootGetters.getUser;
    const game = context.getters.getGame;
    await gameApi.addUserInfo(game.hash, user.uuid, userData);
    let players = context.getters.getPlayers;
    players[user.uuid] = userData;
    context.commit('updatePlayers', players);
  },
  async setWinner({ getters, dispatch }, winData) {
    const game = getters.getGame;
    const winners = getters.getWinners;
    winners[winData.type] = winData.uuid;
    await gameApi.updateWinners(game.hash, winners);
    dispatch('setLocalWinners', winners);
  },
  resetGame(context) {
    context.commit('resetState');
  },
  setLocalWinners(context, winners) {
    context.commit('updateWinners', winners);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
