import { db } from './firebase';

export default {
  async getUserGame(uuid) {
    return new Promise(resolve => {
      db.ref(process.env.VUE_APP_DB_USERS)
        .child(uuid)
        .once('value', function(snapshot) {
          if (snapshot.val()) {
            const game = snapshot.val();
            db.ref(process.env.VUE_APP_DB_GAMES)
              .child(game.game)
              .once('value', function(snapshot) {
                resolve(snapshot.val());
              });
          } else {
            resolve(false);
          }
        });
    });
  },
  async deleteGame(gameId, uuid) {
    return new Promise(resolve => {
      db.ref(process.env.VUE_APP_DB_GAMES)
        .child(gameId)
        .remove();
      db.ref(process.env.VUE_APP_DB_USERS)
        .child(uuid)
        .remove();
      resolve(true);
    });
  }
};
