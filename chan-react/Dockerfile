FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm install -g pm2
RUN npm install

COPY . ./

RUN npm run build

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
