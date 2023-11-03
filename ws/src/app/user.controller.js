'use strict';

const user = require('@/services/user.service');

class UserController {
  async get(req, res, next) {
    const { id } = req.query;
    try {
      res.json(await user.get(id));
    } catch (err) {
      console.error(`Error while getting user`, err.message);
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      res.json(await user.create(req.body));
    } catch (err) {
      console.error(`Error while creating user`, err.message);
      next(err);
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    try {
      res.json(await user.update(id, req.body));
    } catch (err) {
      console.error(`Error while updating user`, err.message);
      next(err);
    }
  }

  async remove(req, res, next) {
    const { id } = req.params;
    try {
      res.json(await user.remove(id));
    } catch (err) {
      console.error(`Error while deleting user`, err.message);
      next(err);
    }
  }
}

module.exports = new UserController();
