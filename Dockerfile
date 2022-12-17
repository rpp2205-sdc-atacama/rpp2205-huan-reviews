FROM node:current-slim
WORKDIR /rpp2205-huan-reviews
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["node", "server/index.js"]