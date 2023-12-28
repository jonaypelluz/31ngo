import { getDefaultState } from './state.js';

export default {
    resetGame(state) {
        Object.assign(state, getDefaultState());
    },
    updateYell(state, payload) {
        state.yell = payload;
    },
    updateGame(state, payload) {
        state.game = payload;
    },
    updateDrawnNumbers(state, payload) {
        state.game.drawnNumbers = [...payload];
    },
    updatePlayers(state, payload) {
        state.game.players = { ...payload };
    },
    updateWinners(state, payload) {
        state.game.winners = { ...payload };
    },
    updateHasStarted(state, payload) {
        state.game.hasStarted = payload;
    },
    updateHasFinished(state, payload) {
        state.game.hasFinished = payload;
    },
};
