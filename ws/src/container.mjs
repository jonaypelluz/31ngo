import { createContainer, asFunction } from 'awilix';
import app from './app.mjs';
import router from './router.mjs';
import server from './server.mjs';

const container = createContainer();

container.register({
  app: asFunction(app).singleton(),
  router: asFunction(router).singleton(),
  server: asFunction(server).singleton(),
});

export default container;
