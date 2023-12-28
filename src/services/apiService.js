import axios from 'axios';

const apiVersion = '/api/v1';

const api = axios.create({
    baseURL: `http://localhost:8080${apiVersion}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default {
    async addPlayer(hash, uuid, data) {
        return await api.post('/add-player', { hash, uuid, ...data });
    },
    async addPlayerUsedCode(hash, code, uuid) {
        const response = api.post('/add-player-used-code', { hash, code, uuid });
        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            return null;
        }
    },
    async addDrawnNumbers(hash, uuid, drawnNumber) {
        return await api.post('/add-drawn-numbers', { hash, uuid, drawnNumber });
    },
    async createGame(game) {
        return await api.post('/create-game', game);
    },
    async deleteGame(hash, uuid) {
        return await api.post('/delete-game', { hash, uuid });
    },
    async getGame(hash) {
        const response = await api.post('/get-game', { hash });
        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            return null;
        }
    },
    async hasFinished(hash, uuid) {
        return await api.post('/has-finished', { hash, uuid });
    },
    async getHostGame(uuid) {
        const response = await api.post('/get-host-game', { uuid });
        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            return null;
        }
    },
    async getPlayer(hash, uuid) {
        const response = await api.post('/get-player', { hash, uuid });
        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            return null;
        }
    },
    async updateWinners(hash, uuid, winners) {
        return await api.post('/update-winners', { hash, uuid, winners });
    },
};
