require('dotenv').config();
const Discord = require('discord.js');

const knex = require('./knex');
const utils = require('./modules/utils');

const client = new Discord.Client();

const token = process.env.DISCORD_TOKEN;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const start = async () => {
  utils.migrateLatest(knex).then(async () => {
    const ismoQuotes = await knex('ismo_quotes').select('id');
    if (ismoQuotes.length === 0) {
      return utils.runSeeds(knex);
    }
  });
};

start();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', async message => {
  if (!message.author.bot) {
    if (await utils.computerComments()) {
      const username = message.author.username;
      message.channel.send(`${username} pls`);
    } else {
      utils.handleMessage(message);
    }
  }
});

const login = async () => {
  for (let tries = 0; ; tries++) {
    try {
      client.login(token);
      break;
    } catch (err) {
      if (tries < 10) {
        console.log('Login failed, sleeping');
        sleep(30000);
      } else throw err;
    }
  }
};

login();
