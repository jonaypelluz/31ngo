export default {
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
  },
};
