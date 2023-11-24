import { Router } from 'express';
import userRoutes from './interfaces/http/userRoutes.mjs';

export default () => {
  const router = Router();

  router.use('/api/v1/users', userRoutes);

  return router;
};
