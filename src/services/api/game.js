import axios from 'axios';

const gameAxios = axios.create({
  baseURL: process.env.VUE_APP_FB_DB
});

gameAxios.interceptors.request.use(
  async config => {
    config.params = config.params || {};
    config.params['auth'] = sessionStorage.getItem('userToken');
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default {
  fetchGame(id) {
    return gameAxios
      .get(`/${process.env.VUE_APP_DB_GAMES}/${id}.json`)
      .then(response => {
        return response.data;
      })
      .catch(error => console.log(error));
  },
  createGame(game) {
    return gameAxios
      .put(`${process.env.VUE_APP_DB_GAMES}/${game.hash}.json`, game)
      .then(response => {
        return response.data;
      });
  },
  updateWinners(hash, data) {
    return gameAxios
      .put(`${process.env.VUE_APP_DB_GAMES}/${hash}/winners.json`, {
        line: data['line'] ?? null,
        bingo: data['bingo'] ?? null
      })
      .then(response => {
        return response.data;
      });
  },
  addGameToUser(game) {
    return gameAxios
      .put(`${process.env.VUE_APP_DB_USERS}/${game.host}.json`, {
        game: game.hash
      })
      .then(response => {
        return response.data;
      });
  },
  addDrawnNumbers(game) {
    return gameAxios
      .put(
        `${process.env.VUE_APP_DB_GAMES}/${game.hash}/drawnNumbers.json`,
        game.drawnNumbers
      )
      .then(response => {
        return response.data;
      });
  },
  hasStarted(hash) {
    return gameAxios
      .put(`${process.env.VUE_APP_DB_GAMES}/${hash}/hasStarted.json`, true)
      .then(response => {
        return response.data;
      });
  },
  hasFinished(hash) {
    return gameAxios
      .put(`${process.env.VUE_APP_DB_GAMES}/${hash}/hasFinished.json`, true)
      .then(response => {
        return response.data;
      });
  },
  addUserInfo(hash, uuid, data) {
    return gameAxios
      .put(`${process.env.VUE_APP_DB_GAMES}/${hash}/players/${uuid}.json`, data)
      .then(response => {
        return response.data;
      });
  }
};
