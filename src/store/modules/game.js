const getDefaultState = () => {
  return {
    game: {
      hash: null,
      host: null,
      hasStarted: false,
      hasFinished: false,
      drawnNumbers: [],
      winners: [],
      players: {},
      maxPlayers: null
    },
    yell: {
      type: null,
      uuid: null
    }
  };
};

const getDefaultYellState = () => {
  return {
    type: null,
    uuid: null
  };
};

// initial state
const state = getDefaultState();

const getters = {
  getYell(state) {
    return state.yell;
  },
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
  getLastDrawnNumber(state) {
    return state.game.drawnNumbers[state.game.drawnNumbers.length - 1];
  },
  getWinners(state) {
    return state.game.winners ?? [];
  }
};

const mutations = {
  resetGame(state) {
    Object.assign(state, getDefaultState());
  },
  updateYell(state, payload) {
    state.yell = payload;
  },
  updateGame(state, payload) {
    state.game = payload;
  },
  updatePlayers(state, payload) {
    state.game.players = payload;
  },
  updateDrawnNumbers(state, payload) {
    state.game.drawnNumbers = payload;
  },
  updateHasStarted(state, payload) {
    state.game.hasStarted = payload;
  },
  updateHasFinished(state, payload) {
    state.game.hasFinished = payload;
  },
  updateWinners(state, payload) {
    state.game.winners = payload;
  }
};

const actions = {
  addDrawnNumber({ getters, commit }, num) {
    const drawnNumbers = getters.getDrawnNumbers;
    if (!drawnNumbers.includes(num)) {
      drawnNumbers.push(num);
    }
    commit('updateDrawnNumbers', drawnNumbers);
  },
  addUserInfo({ getters, commit }, userData) {
    let players = getters.getPlayers;
    players[userData.uuid] = userData.data;
    commit('updatePlayers', players);
  },
  createGame(context, data) {
    const defaultGame = getDefaultState();
    const gameData = {
      ...defaultGame.game,
      ...data
    };
    context.commit('updateGame', gameData);
  },
  hasStarted(context) {
    context.commit('updateHasStarted', true);
  },
  hasFinished(context) {
    context.commit('updateHasFinished', true);
  },
  resetGame(context) {
    context.commit('resetGame');
  },
  resetYell(context) {
    context.commit('updateYell', getDefaultYellState());
  },
  setWinner({ getters, commit }, winData) {
    const winners = getters.getWinners;
    winners[winData.type] = winData.uuid;
    commit('updateWinners', winners);
  },
  updateGame(context, data) {
    const game = context.getters.getGame;
    const gameData = {
      ...game,
      ...data
    };
    context.commit('updateGame', gameData);
  },
  updateYell(context, data) {
    context.commit('updateYell', data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
