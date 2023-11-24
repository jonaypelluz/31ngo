export default ({ server }) => ({
  start: () => Promise.resolve().then(server.start),
});
