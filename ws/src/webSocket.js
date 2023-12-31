import { WebSocketServer } from 'ws';
import handleMsg from './game.js';

function setupWebSocketServer(server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (wsClient) => {
        wsClient.send('{ "connection" : "ok"}');
        wsClient.on('message', (message) => {
            handleMsg(wsClient, message);
        });
    });
}

export default setupWebSocketServer;
