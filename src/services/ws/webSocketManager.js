import EventEmitter from 'events';

class WebSocketManager extends EventEmitter {
  #reconnectInterval = 1000;
  #maxReconnectInterval = 3000;

  constructor() {
    super();

    this.games = [];
    this.ws = null;
  }

  connect(gameId, uuid) {
    this.ws = new WebSocket('wss://31ngo.com:8443');

    this.ws.onmessage = event => {
      const response = JSON.parse(event.data);
      console.log(response);
      this.emit('ws-msg', response);
    };

    this.ws.onopen = () => {
      this.send({ gameId, type: 'connect', uuid });
    };

    this.ws.onclose = event => {
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

    this.ws.onerror = error => {
      this.emit('ws-error', error);
      this.ws.close();
    };
  }

  send(data) {
    this.ws.send(JSON.stringify(data));
  }

  disconnect() {
    this.ws.close();
  }
}

export const wsManager = new WebSocketManager();
