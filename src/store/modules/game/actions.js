import { getDefaultState, getDefaultYellState } from './state.js';

export default {
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
      ...data,
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
      ...data,
    };
    context.commit('updateGame', gameData);
  },
  updateYell(context, data) {
    context.commit('updateYell', data);
  },
};
