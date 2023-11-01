FROM node:18-alpine

WORKDIR /app

RUN apk update && apk add bash git

COPY ws/package*.json ./

RUN npm install

COPY ws/ .

EXPOSE 8083

CMD [ "node", "index.js" ]
