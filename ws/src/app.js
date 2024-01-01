import dotenv from 'dotenv';
import createServer from './server.js';
import logger from './logger.js';
import setupWebSocketServer from './webSocket.js';

dotenv.config();

const server = createServer();
setupWebSocketServer(server);

const serverPort = process.env.WS_PORT || 3000;
server.listen(serverPort, () => {
    logger.info(`Websocket server started on port ${serverPort}`);
});
