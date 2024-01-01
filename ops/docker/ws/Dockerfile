FROM node:20-alpine

WORKDIR /app

COPY ./ws/package*.json ./
RUN npm install

COPY ./ws .

CMD ["npm", "start"]
