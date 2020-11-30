import { db } from './firebase';

export default {
  async getUserGame(uuid) {
    return new Promise(resolve => {
      db.ref('users')
        .child(uuid)
        .once('value', function(snapshot) {
          if (snapshot.val()) {
            const game = snapshot.val();
            db.ref('games')
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
      db.ref('games')
        .child(gameId)
        .remove();
      db.ref('users')
        .child(uuid)
        .remove();
      resolve(true);
    });
  }
};
