FROM node:18.14.2-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production --pure-lockfile

COPY data ./data
COPY src ./src
COPY .env .

EXPOSE 80

CMD ["npm", "run", "dev"]