FROM node:18-alpine

EXPOSE 3001

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm ci

COPY NATS.js /usr/src/app
COPY api.js /usr/src/app

CMD ["node", "api.js"]