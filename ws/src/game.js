import isValidResponse from './utils.js';
import logger from './logger.js';

const games = [];

function sendMessages(response, message, senderWsClient) {
    if (!games[response.gameId]) return;

    Object.values(games[response.gameId].clients).forEach((client) => {
        if (client !== senderWsClient) {
            client.send(`{ "message" : ${message} }`);
        }
    });
}

function addGame(gameId) {
    games[gameId] = {
        clients: {},
        nums: [],
        drawnNum: null,
    };
}

function handleMsg(wsClient, message) {
    let response;
    try {
        response = JSON.parse(message);
    } catch (error) {
        logger.error('Error parsing message:', message);
        logger.error(error);
        wsClient.send(JSON.stringify({ error: 'Invalid message format' }));
        return;
    }

    if (isValidResponse(response)) {
        switch (response.type) {
            case 'connect':
                if (games && !games[response.gameId]) {
                    addGame(response.gameId);
                }
                games[response.gameId].clients[response.uuid] = wsClient;
                logger.info('games (connect): ', games);
                break;

            case 'num':
                if (games && games[response.gameId]) {
                    games[response.gameId].drawnNum = response.num;
                    games[response.gameId].nums.push(response.num);
                }
                logger.info('games (num): ', games);
                break;

            case 'finish':
                sendMessages(response, message, wsClient);
                if (games.indexOf(response.gameId) > -1) {
                    games.splice(games.indexOf(response.gameId), 1);
                }
                logger.info('games (finish): ', games);
                break;

            default:
                logger.info('no type ', response);
                break;
        }

        if (games && games[response.gameId]) {
            sendMessages(response, message, wsClient);
        }
    }
}

export default handleMsg;
