FROM node:20-alpine

WORKDIR /app

RUN apk update && apk add bash git
COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "serve"]
