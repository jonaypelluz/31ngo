import EventEmitter from 'events';

class WebSocketService extends EventEmitter {
    #reconnectInterval = 1000;
    #maxReconnectInterval = 3000;

    constructor() {
        super();
        this.ws = null;
    }

    connect(gameId, uuid) {
        this.ws = new WebSocket(import.meta.env.VITE_APP_WS_URL);

        this.ws.onmessage = (event) => {
            const response = JSON.parse(event.data);
            this.emit('ws-message', response);
        };

        this.ws.onopen = () => {
            this.send({ gameId, type: 'connect', uuid });
            this.emit('ws-connected', true);
        };

        this.ws.onclose = (event) => {
            if (event && event.code !== 1000) {
                setTimeout(() => {
                    if (this.#reconnectInterval < this.#maxReconnectInterval) {
                        this.#reconnectInterval += 1000;
                    }
                    this.connect(gameId, uuid);
                }, this.#reconnectInterval);
            }
            this.emit('ws-connected', false);
        };

        this.ws.onerror = (error) => {
            this.emit('ws-error', error);
            this.ws.close();
        };
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

export const wsService = new WebSocketService();
