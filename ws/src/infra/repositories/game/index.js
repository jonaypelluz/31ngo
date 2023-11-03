'use strict';

class GameController {
  async get(req) {
    const { id } = req.query;
    console.log('GET', id);
  }

  async create(req) {
    const game = req.body;
    console.log('CREATE', game);
  }

  async update(req) {
    const { id } = req.params;
    const game = req.body;
    console.log('UPDATE', game);
    console.log('UPDATE', id);
  }

  async remove(req) {
    const { id } = req.params;
    console.log('REMOVE', id);
  }
}

module.exports = GameController;

