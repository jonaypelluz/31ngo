import EventEmitter from 'events';
import Peer from 'peerjs';

class PeerHostService extends EventEmitter {
    constructor() {
        super();
        this.peer = null;
        this.connections = {};
        this.playerData = {};
    }

    create(gameId) {
        this.peer = new Peer(gameId);

        this.peer.on('open', () => {
            this.emit('peer-ready');
        });

        this.peer.on('connection', (conn) => {
            conn.on('open', () => {
                this.emit('new-connection', conn);
            });

            conn.on('data', (data) => {
                this._handleMessage(conn, data);
            });

            conn.on('close', () => {
                const uuid = Object.keys(this.connections).find(
                    (k) => this.connections[k] === conn,
                );
                if (uuid) {
                    delete this.connections[uuid];
                }
            });
        });

        this.peer.on('error', (err) => {
            this.emit('peer-error', err);
        });
    }

    _handleMessage(senderConn, data) {
        if (data.type === 'connect') {
            this.connections[data.uuid] = senderConn;
        } else if (data.type === 'addplayer' && data.data) {
            this.playerData[data.uuid] = data.data;
        }
        this._broadcast(data, senderConn);
        this.emit('peer-message', data);
    }

    _broadcast(data, excludeConn = null) {
        Object.values(this.connections).forEach((conn) => {
            if (conn !== excludeConn && conn.open) {
                conn.send(data);
            }
        });
    }

    send(data) {
        this._broadcast(data);
    }

    sendToConnection(conn, data) {
        if (conn && conn.open) {
            conn.send(data);
        }
    }

    getPlayerData(uuid) {
        return this.playerData[uuid] || null;
    }

    destroy() {
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
        this.connections = {};
        this.playerData = {};
    }
}

export const peerHostService = new PeerHostService();
