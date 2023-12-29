import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const processResponse = (response) => {
    if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
    } else {
        return null;
    }
};

export default {
    async addPlayer(hash, uuid, data) {
        await api.post('/add-player', { hash, uuid, ...data });
    },
    async addPlayerUsedCode(hash, code, uuid) {
        await api.post('/add-player-used-code', { hash, code, uuid });
    },
    async addDrawnNumbers(hash, uuid, drawnNumber) {
        await api.post('/add-drawn-numbers', { hash, uuid, drawnNumber });
    },
    async createGame(game) {
        await api.post('/create-game', game);
    },
    async deleteGame(hash, uuid) {
        await api.post('/delete-game', { hash, uuid });
    },
    async getGame(hash) {
        try {
            const response = await api.post('/get-game', { hash });
            return processResponse(response);
        } catch (error) {
            console.error('Error in getGame:', error);
            return null;
        }
    },
    async hasFinished(hash, uuid) {
        return await api.post('/has-finished', { hash, uuid });
    },
    async getHostGame(uuid) {
        try {
            const response = await api.post('/get-host-game', { uuid });
            return processResponse(response);
        } catch (error) {
            console.error('Error in getHostName:', error);
            return null;
        }
    },
    async getPlayer(hash, uuid) {
        try {
            const response = await api.post('/get-player', { hash, uuid });
            return processResponse(response);
        } catch (error) {
            console.error('Error in getPlayer:', error);
            return null;
        }
    },
    async updateWinners(hash, uuid, winners) {
        await api.post('/update-winners', { hash, uuid, winners });
    },
};
