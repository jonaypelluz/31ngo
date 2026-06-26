import { peerHostService } from '@services/peerHostService';
import { peerPlayerService } from '@services/peerPlayerService';

const getDefaultState = () => ({
    game: {
        hash: null,
        host: null,
        mode: 'public',
        codes: [],
        usedCodes: [],
        hasStarted: false,
        hasFinished: false,
        drawnNumbers: [],
        winners: [],
        players: {},
        maxPlayers: null,
    },
    yell: {
        type: null,
        uuid: null,
    },
    peerConnected: false,
    role: null,
});

const getDefaultYellState = () => ({ type: null, uuid: null });

const state = getDefaultState();

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
    updatePeerConnected(state, status) {
        state.peerConnected = status;
    },
    updateRole(state, role) {
        state.role = role;
    },
    addUsedCode(state, code) {
        if (!state.game.usedCodes.includes(code)) {
            state.game.usedCodes = [...state.game.usedCodes, code];
        }
    },
};

const getters = {
    getYell: (state) => state.yell,
    getGame: (state) => state.game,
    getPlayers: (state) => state.game.players,
    getMaxPlayers: (state) => state.game.maxPlayers,
    getDrawnNumbers: (state) => state.game.drawnNumbers,
    getLastDrawnNumber: (state) => state.game.drawnNumbers[state.game.drawnNumbers.length - 1],
    getWinners: (state) => state.game.winners ?? [],
};

const actions = {
    addDrawnNumber({ getters, commit }, num) {
        const drawnNumbers = [...getters.getDrawnNumbers];
        if (!drawnNumbers.includes(num)) {
            drawnNumbers.push(num);
            commit('updateDrawnNumbers', drawnNumbers);
        }
    },
    addPlayerUuid({ getters, commit }, { uuid, name }) {
        const players = { ...getters.getPlayers };
        if (!players[uuid]) {
            players[uuid] = { name: name || uuid };
            commit('updatePlayers', players);
        }
    },
    setWinner({ getters, commit }, winData) {
        const winners = { ...getters.getWinners };
        winners[winData.type] = winData.uuid;
        commit('updateWinners', winners);
    },
    createGame(context, data) {
        const defaultGame = getDefaultState();
        context.commit('updateGame', { ...defaultGame.game, ...data });
    },
    hasStarted(context) {
        context.commit('updateHasStarted', true);
    },
    hasFinished(context) {
        context.commit('updateHasFinished', true);
    },
    resetGame(context) {
        peerHostService.destroy();
        peerPlayerService.destroy();
        context.commit('resetGame');
    },
    resetYell(context) {
        context.commit('updateYell', getDefaultYellState());
    },
    updateGame(context, data) {
        context.commit('updateGame', { ...context.getters.getGame, ...data });
    },
    updateYell(context, data) {
        context.commit('updateYell', data);
    },

    handlePeerMessage({ dispatch, commit }, response) {
        switch (response.type) {
            case 'addplayer':
                dispatch('addPlayerUuid', { uuid: response.uuid, name: response.data?.name });
                if (response.data?.code) {
                    commit('addUsedCode', response.data.code);
                }
                break;
            case 'finish':
                dispatch('hasFinished');
                break;
            case 'bingo':
            case 'line':
                dispatch('updateYell', { type: response.type, uuid: response.uuid });
                break;
            case 'notwinner':
                dispatch('resetYell');
                break;
            case 'num':
                dispatch('addDrawnNumber', response.num);
                break;
            case 'winner':
                dispatch('setWinner', { type: response.winType, uuid: response.uuid });
                dispatch('resetYell');
                break;
            case 'game-state':
                break;
            default:
                console.info('Unknown peer message:', response);
        }
    },

    connectPeerAsHost({ dispatch, commit, getters }, { gameId }) {
        peerHostService.removeAllListeners();

        peerHostService.on('new-connection', (conn) => {
            peerHostService.sendToConnection(conn, {
                type: 'game-state',
                game: getters.getGame,
            });
        });

        peerHostService.on('peer-message', (data) => {
            dispatch('handlePeerMessage', data);
        });

        peerHostService.on('peer-error', (err) => {
            console.error('Host peer error:', err);
        });

        commit('updateRole', 'host');
        commit('updatePeerConnected', true);
        peerHostService.create(gameId);
    },

    connectPeerAsPlayer({ dispatch, commit }, { gameId, uuid }) {
        peerPlayerService.removeAllListeners();

        peerPlayerService.on('peer-message', (data) => {
            dispatch('handlePeerMessage', data);
        });

        peerPlayerService.on('peer-connected', (status) => {
            commit('updatePeerConnected', status);
        });

        peerPlayerService.on('peer-error', () => {
            commit('updatePeerConnected', false);
        });

        commit('updateRole', 'player');
        peerPlayerService.connect(gameId, uuid);
    },

    sendPeerMessage({ state }, data) {
        if (state.role === 'host') {
            peerHostService.send(data);
        } else {
            peerPlayerService.send(data);
        }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
