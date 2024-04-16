FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install -g pm2
RUN npm install

COPY . .

RUN npx prisma generate
RUN npx prisma db push
RUN npm run build

EXPOSE 8080

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]