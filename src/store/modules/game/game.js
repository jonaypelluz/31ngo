import { wsService } from '@/services/WebSocketService';

const getDefaultState = () => {
    return {
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
            players: [],
            maxPlayers: null,
        },
        yell: {
            type: null,
            uuid: null,
        },
        wsConnected: false,
    };
};

const getDefaultYellState = () => {
    return {
        type: null,
        uuid: null,
    };
};

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
        state.game.players = [...payload];
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
    updateWsConnected(state, status) {
        state.wsConnected = status;
    },
};

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
    },
};

const actions = {
    addDrawnNumber({ getters, commit }, num) {
        const drawnNumbers = [...getters.getDrawnNumbers];
        if (!drawnNumbers.includes(num)) {
            drawnNumbers.push(num);
            commit('updateDrawnNumbers', drawnNumbers);
        }
    },
    addPlayerUuid({ getters, commit }, uuid) {
        const players = [...getters.getPlayers];
        if (!players.includes(uuid)) {
            players.push(uuid);
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
    initWS({ dispatch }) {
        wsService.on('ws-message', (response) => {
            switch (response.type) {
                case 'addplayer':
                    dispatch('addPlayerUuid', response.uuid);
                    break;
                case 'finish':
                    dispatch('hasFinished');
                    break;
                case 'bingo':
                case 'line':
                    dispatch('updateYell', {
                        type: response.type,
                        uuid: response.uuid,
                    });
                    break;
                case 'notwinner':
                    dispatch('resetYell');
                    break;
                case 'num':
                    dispatch('addDrawnNumber', response.num);
                    break;
                case 'winner':
                    dispatch('setWinner', {
                        type: response.winType,
                        uuid: response.uuid,
                    });
                    dispatch('resetYell');
                    break;
            }
        });

        wsService.on('ws-connected', (status) => {
            commit('setWsConnected', status);
        });

        wsService.on('ws-error', (error) => {
            console.error('WebSocket Error:', error);
            commit('setWsConnected', false);
        });
    },
    sendWSMessage({ state }, data) {
        if (state.wsConnected) {
            wsService.send(JSON.stringify(data));
        }
    },
    connectWS({ dispatch }, { gameId, uuid }) {
        wsService.connect(gameId, uuid);
        dispatch('initWS');
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
