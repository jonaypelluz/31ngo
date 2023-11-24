import express from 'express';

export default ({ router }) => {
  const app = express();

  app.disable('x-powered-by');
  app.use(router);

  return {
    app,
    start: async () =>
      new Promise(() => {
        const http = app.listen(3000, () => {
          const { port } = http.address();
          console.log(`API - Port ${port}`);
        });
      }),
  };
};
