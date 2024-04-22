FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pm2
RUN npm install
RUN npm run build

COPY . .

EXPOSE 3000

CMD ["pm2", "start", "npm", "--name", "chan-react", "--", "start"]
