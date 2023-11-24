import dotenv from 'dotenv';
import container from './src/container.mjs';

dotenv.config();
const app = container.resolve('app');

app.start().catch((error) => {
  console.error(error.stack);
  process.exit();
});

// const WebSocket = require('ws');
// const wss = new WebSocket.Server({
//   server: server,
//   perMessageDeflate: false
// });

// let games = [];

// wss.on('connection', (wsClient) => {
//   wsClient.send('{ "connection" : "ok"}');

//   wsClient.on('message', (message) => {
//     _handleMsg(message);
//   });

//   function _handleMsg(message) {
//     const response = JSON.parse(message);
//     if (_validResponseObject(response)) {
//       switch (response.type) {
//         case 'connect':
//           if (games && !games[response.gameId]) {
//             _addGame(response.gameId);
//           }
//           games[response.gameId].clients[response.uuid] = wsClient;
//           break;

//         case 'num':
//           if (games && games[response.gameId]) {
//             games[response.gameId].drawnNum = response.num;
//             games[response.gameId].nums.push(response.num);
//           }
//           break;

//         case 'finish':
//           _sendMessages(response, message);
//           if (games.indexOf(response.gameId) > -1) {
//             games.splice(games.indexOf(response.gameId), 1);
//           }
//           break;

//         default:
//           break;
//       }

//       if (games && games[response.gameId]) {
//         _sendMessages(response, message);
//       }
//     }
//   }

//   function _sendMessages(response, message) {
//     for (const idx in games[response.gameId].clients) {
//       const client = games[response.gameId].clients[idx];
//       if (client !== wsClient) {
//         client.send(`{ "message" : ${message} }`);
//       }
//     }
//   }

//   function _addGame(gameId) {
//     games[gameId] = {
//       clients: [],
//       nums: [],
//       drawnNum: null,
//     };
//   }

//   function _validResponseObject(response) {
//     return (
//       typeof response === 'object' &&
//       response !== null &&
//       Object.prototype.hasOwnProperty.call(response, 'type') &&
//       Object.prototype.hasOwnProperty.call(response, 'gameId') &&
//       Object.prototype.hasOwnProperty.call(response, 'uuid')
//     );
//   }
// });

