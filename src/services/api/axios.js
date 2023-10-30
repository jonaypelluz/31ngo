
export default {
  async addUserInfo(hash, uuid, data) {
    return new Promise((resolve) => {
      db.ref(`${process.env.VUE_APP_DB_GAMES}/${hash}/players/${uuid}`).set(data);
      resolve(true);
    });
  },
  async addUsedCode(hash, codes) {
    return new Promise((resolve) => {
      db.ref(`${process.env.VUE_APP_DB_GAMES}/${hash}/usedCodes`).set(codes);
      resolve(true);
    });
  },
  async addDrawnNumbers(game) {
    return new Promise((resolve) => {
      db.ref(`${process.env.VUE_APP_DB_GAMES}/${game.hash}/drawnNumbers`).set(game.drawnNumbers);
      resolve(true);
    });
  },
  async createGame(game) {
    return new Promise((resolve) => {
      db.ref(`${process.env.VUE_APP_DB_GAMES}/${game.hash}`).set(game);
      db.ref(`${process.env.VUE_APP_DB_USERS}/${game.host}`).set({
        game: game.hash,
      });
      resolve(true);
    });
  },
  async deleteGame(gameId, uuid) {
    return new Promise((resolve) => {
      db.ref(process.env.VUE_APP_DB_GAMES).child(gameId).remove();
      db.ref(process.env.VUE_APP_DB_USERS).child(uuid).remove();
      resolve(true);
    });
  },
  async getGame(gameId) {
    return new Promise((resolve) => {
      db.ref(process.env.VUE_APP_DB_GAMES)
        .child(gameId)
        .once('value', function (snapshot) {
          if (snapshot.val()) {
            resolve(snapshot.val());
          } else {
            resolve(false);
          }
        });
    });
  },
  async hasStarted(hash) {
    return new Promise((resolve) => {
      db.ref(`${process.env.VUE_APP_DB_GAMES}/${hash}/hasStarted`).set(true);
      resolve(true);
    });
  },
  async hasFinished(hash) {
    return new Promise((resolve) => {
      db.ref(`${process.env.VUE_APP_DB_GAMES}/${hash}/hasFinished`).set(true);
      resolve(true);
    });
  },
  async getUserGame(uuid) {
    return new Promise((resolve) => {
      db.ref(process.env.VUE_APP_DB_USERS)
        .child(uuid)
        .once('value', function (snapshot) {
          if (snapshot.val()) {
            const game = snapshot.val();
            db.ref(process.env.VUE_APP_DB_GAMES)
              .child(game.game)
              .once('value', function (snapshot) {
                resolve(snapshot.val());
              });
          } else {
            resolve(false);
          }
        });
    });
  },
  async updateWinners(hash, data) {
    return new Promise((resolve) => {
      db.ref(`${process.env.VUE_APP_DB_GAMES}/${hash}/winners`).set({
        line: data['line'] ?? null,
        bingo: data['bingo'] ?? null,
      });
      resolve(true);
    });
  },
};
