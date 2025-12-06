FROM node:20-slim
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY src ./src
COPY tsconfig.json ./

RUN npm run build

CMD ["node", "./dist/index.js"]