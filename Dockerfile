FROM node:20-alpine

WORKDIR /app

COPY package*.json ./


RUN npm install --omit=dev && npm cache clean --force

COPY . .

ENV NODE_ENV=development
ENV PORT=4200

EXPOSE 4200

CMD ["node", "server.js"]