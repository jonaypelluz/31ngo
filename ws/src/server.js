import https from 'https';
import http from 'http';
import fs from 'fs';
import express from 'express';

const app = express();
let server;

function createServer() {
    if (process.env.APP_ENV === 'prod') {
        const key = fs.readFileSync('/home/pm2user/wss/certs/privkey.pem');
        const cert = fs.readFileSync('/home/pm2user/wss/certs/fullchain.pem');
        server = https.createServer({ key, cert }, app);
    } else {
        server = http.createServer(app);
    }
    return server;
}

export default createServer;
