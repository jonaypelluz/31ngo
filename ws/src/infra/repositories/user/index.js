'use strict';

class UserController {
  async get(req) {
    const { id } = req.params;
    console.log('GET', id);
  }

  async create(req) {
    const user = req.body;
    console.log('CREATE', user);
  }

  async update(req) {
    const { id } = req.params;
    const user = req.body;
    console.log('UPDATE', user);
    console.log('UPDATE', id);
  }

  async remove(req) {
    const { id } = req.params;
    console.log('REMOVE', id);
  }
}

module.exports = UserController;

