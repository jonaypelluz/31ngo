import gameAxios from './gameAxios';

export default {
  fetchGame(id) {
    return gameAxios
      .get(`/games/${id}.json`)
      .then(response => {
        return response.data;
      })
      .catch(error => console.log(error));
  },
  createGame(game) {
    return gameAxios.put(`games/${game.hash}.json`, game).then(response => {
      return response.data;
    });
  },
  updateWinners(hash, data) {
    return gameAxios
      .put(`games/${hash}/winners.json`, {
        line: data['line'] ?? null,
        bingo: data['bingo'] ?? null
      })
      .then(response => {
        return response.data;
      });
  },
  addGameToUser(game) {
    return gameAxios
      .put(`users/${game.host}.json`, {
        game: game.hash
      })
      .then(response => {
        return response.data;
      });
  },
  addDrawnNumbers(game) {
    return gameAxios
      .put(`games/${game.hash}/drawnNumbers.json`, game.drawnNumbers)
      .then(response => {
        return response.data;
      });
  },
  hasStarted(hash) {
    return gameAxios
      .put(`games/${hash}/hasStarted.json`, true)
      .then(response => {
        return response.data;
      });
  },
  hasFinished(hash) {
    return gameAxios
      .put(`games/${hash}/hasFinished.json`, true)
      .then(response => {
        return response.data;
      });
  },
  addUserInfo(hash, uuid, data) {
    return gameAxios
      .put(`games/${hash}/players/${uuid}.json`, data)
      .then(response => {
        return response.data;
      });
  }
};
