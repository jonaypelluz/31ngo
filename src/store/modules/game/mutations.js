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
    },
};
