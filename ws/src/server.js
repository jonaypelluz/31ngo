const https = require("https");
const express = require("express");
const fs = require("fs");
const WebSocket = require("ws");

const cert = fs.readFileSync("/home/pm2user/wss/certs/fullchain.pem");
const key = fs.readFileSync("/home/pm2user/wss/certs/privkey.pem");

const app = express();
const server = https.createServer({ key, cert }, app);
const wss = new WebSocket.Server({ server });

const serverPort = 8443;

let games = [];

//when a websocket connection is established
wss.on("connection", wsClient => {
    wsClient.send('{ "connection" : "ok"}');

    wsClient.on("message", message => {
        _handleMsg(message);
    });

    function _handleMsg(message) {
        const response = JSON.parse(message);
        if (_validResponseObject(response)) {
            switch (response.type) {
                case "connect":
                    if (games && !games[response.gameId]) {
                        _addGame(response.gameId);
                    }
                    games[response.gameId].clients[response.uuid] = wsClient;
                    break;

                case "num":
                    if (games && games[response.gameId]) {
                        games[response.gameId].drawnNum = response.num;
                        games[response.gameId].nums.push(response.num);
                    }
                    break;

                case "finish":
                    _sendMessages(response, message);
                    const index = games.indexOf(response.gameId);
                    if (index > -1) {
                        games.splice(index, 1);
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

    function _sendMessage(response, message) {
        if (
            games[response.gameId] &&
            games[response.gameId].clients[response.uuid]
        ) {
            const client = games[response.gameId].clients[response.uuid];
            client.send(`{ "message" : ${message} }`);
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
            typeof response === "object" &&
            response !== null &&
            response.hasOwnProperty("type") &&
            response.hasOwnProperty("gameId") &&
            response.hasOwnProperty("uuid")
        );
    }
});

//start the web server
server.listen(serverPort, () => {
    console.log(`Websocket server started on port ` + serverPort);
});
