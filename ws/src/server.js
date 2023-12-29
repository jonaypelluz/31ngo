require('dotenv').config();
const https = process.env.APP_ENV === 'prod' ? require('https') : require('http');
const express = require('express');
const fs = require('fs');
const WebSocket = require('ws');

const app = express();
let server;

if (process.env.APP_ENV === 'prod') {
    const key = fs.readFileSync('/home/pm2user/wss/certs/privkey.pem');
    const cert = fs.readFileSync('/home/pm2user/wss/certs/fullchain.pem');
    server = https.createServer({ key, cert }, app);
} else {
    server = https.createServer(app);
}

const wss = new WebSocket.Server({ server });

const serverPort = process.env.WS_PORT;

let games = [];

//when a websocket connection is established
wss.on('connection', (wsClient) => {
    wsClient.send('{ "connection" : "ok"}');

    wsClient.on('message', (message) => {
        _handleMsg(message);
    });

    function _handleMsg(message) {
        const response = JSON.parse(message);
        if (_validResponseObject(response)) {
            switch (response.type) {
                case 'connect':
                    if (games && !games[response.gameId]) {
                        _addGame(response.gameId);
                    }
                    games[response.gameId].clients[response.uuid] = wsClient;
                    break;

                case 'num':
                    if (games && games[response.gameId]) {
                        games[response.gameId].drawnNum = response.num;
                        games[response.gameId].nums.push(response.num);
                    }
                    break;

                case 'finish':
                    _sendMessages(response, message);
                    if (games.indexOf(response.gameId) > -1) {
                        games.splice(games.indexOf(response.gameId), 1);
                    }
                    break;

                default:
                    break;
            }

            if (games && games[response.gameId]) {
                _sendMessages(response, message);
            }
        }
    }

    function _sendMessages(response, message) {
        for (const idx in games[response.gameId].clients) {
            const client = games[response.gameId].clients[idx];
            if (client !== wsClient) {
                client.send(`{ "message" : ${message} }`);
            }
        }
    }

    function _addGame(gameId) {
        games[gameId] = {
            clients: [],
            nums: [],
            drawnNum: null,
        };
    }

    function _validResponseObject(response) {
        return (
            typeof response === 'object' &&
            response !== null &&
            Object.prototype.hasOwnProperty.call(response, 'type') &&
            Object.prototype.hasOwnProperty.call(response, 'gameId') &&
            Object.prototype.hasOwnProperty.call(response, 'uuid')
        );
    }
});

//start the web server
server.listen(serverPort, () => {
    console.info(`Websocket server started on port ` + serverPort);
});
