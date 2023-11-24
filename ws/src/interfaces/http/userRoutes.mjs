import { Router } from 'express';

const UserController = require('@/repositories/user');

export default () => {
  const router = Router();

  router.get('/:id', UserController.get);
  router.put('/:id', UserController.update);
  router.delete('/:id', UserController.remove);
  router.post('/', UserController.create);

  return router;
};
