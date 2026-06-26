import EventEmitter from 'events';
import Peer from 'peerjs';

class PeerPlayerService extends EventEmitter {
    constructor() {
        super();
        this.peer = null;
        this.conn = null;
        this._currentGameId = null;
        this._uuid = null;
        this._reconnectTimeout = null;
    }

    connect(gameId, uuid) {
        if (this._currentGameId === gameId && this.conn && this.conn.open) {
            this.emit('peer-connected', true);
            return;
        }

        this._currentGameId = gameId;
        this._uuid = uuid;

        if (this.peer) {
            this.peer.destroy();
        }

        this.peer = new Peer();

        this.peer.on('open', () => {
            this.conn = this.peer.connect(gameId, { reliable: true });

            this.conn.on('open', () => {
                this.conn.send({ type: 'connect', uuid });
                this.emit('peer-connected', true);
            });

            this.conn.on('data', (data) => {
                this.emit('peer-message', data);
            });

            this.conn.on('close', () => {
                this.emit('peer-connected', false);
                this._scheduleReconnect();
            });
        });

        this.peer.on('error', () => {
            this.emit('peer-error');
            this.emit('peer-connected', false);
        });
    }

    _scheduleReconnect() {
        if (this._reconnectTimeout) {
            clearTimeout(this._reconnectTimeout);
        }
        this._reconnectTimeout = setTimeout(() => {
            if (this._currentGameId && this._uuid) {
                this.connect(this._currentGameId, this._uuid);
            }
        }, 2000);
    }

    send(data) {
        if (this.conn && this.conn.open) {
            this.conn.send(data);
        }
    }

    destroy() {
        if (this._reconnectTimeout) {
            clearTimeout(this._reconnectTimeout);
        }
        this._currentGameId = null;
        this._uuid = null;
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
        this.conn = null;
    }
}

export const peerPlayerService = new PeerPlayerService();
