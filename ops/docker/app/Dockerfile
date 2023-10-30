FROM node:18-alpine

WORKDIR /app

RUN apk update && apk add bash git

RUN yarn global add http-server

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8080
CMD [ "http-server", "dist" ]
