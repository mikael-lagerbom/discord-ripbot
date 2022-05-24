FROM mhart/alpine-node:12.16

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production --pure-lockfile

COPY data ./data
COPY src ./src
COPY .env .

EXPOSE 80

CMD ["npm", "run", "dev"]