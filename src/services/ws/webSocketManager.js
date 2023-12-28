import store from '@/store/index.js';
import EventEmitter from 'events';

class WebSocketManager extends EventEmitter {
    #reconnectInterval = 1000;
    #maxReconnectInterval = 3000;

    static GAME_FINISH = 'GAME_FINISH';

    constructor() {
        super();

        this.games = [];
        this.ws = null;
    }

    connect(gameId, uuid) {
        this.ws = new WebSocket('ws://localhost:8443');

        this.ws.onmessage = (event) => {
            const response = JSON.parse(event.data);
            this.handleWsMsg(response.message);
            this.emit('ws-msg', response);
        };

        this.ws.onopen = () => {
            this.send({ gameId, type: 'connect', uuid });
        };

        this.ws.onclose = (event) => {
            if (event) {
                if (event.code !== 1000) {
                    setTimeout(() => {
                        if (this.reconnectInterval < this.maxReconnectInterval) {
                            this.reconnectInterval += 1000;
                        }
                        this.connect();
                    }, this.reconnectInterval);
                }
            }
        };

        this.ws.onerror = (error) => {
            this.emit('ws-error', error);
            this.ws.close();
        };
    }

    handleWsMsg(response) {
        if (response && 'type' in response) {
            switch (response.type) {
                case 'adduser':
                    store.dispatch('gam/addUserInfo', {
                        uuid: response.uuid,
                        data: response.data,
                    });
                    break;

                case 'finish':
                    store.dispatch('gam/hasFinished', response.gameId);
                    break;

                case 'bingo':
                case 'line':
                    store.dispatch('gam/updateYell', {
                        type: response.type,
                        uuid: response.uuid,
                    });
                    break;

                case 'notwinner':
                    store.dispatch('gam/resetYell');
                    break;

                case 'num':
                    store.dispatch('gam/addDrawnNumber', response.num);
                    break;

                case 'winner':
                    store.dispatch('gam/setWinner', {
                        type: response.winType,
                        uuid: response.uuid,
                    });
                    store.dispatch('gam/resetYell');
                    break;

                default:
                    break;
            }
        }
    }

    send(data) {
        this.ws.send(JSON.stringify(data));
    }

    disconnect() {
        this.ws.close();
    }
}

export const wsManager = new WebSocketManager();
