FROM node:18-alpine

WORKDIR /app

COPY ./ws/package*.json ./
RUN npm install

COPY ./ws .

CMD ["npm", "start"]
