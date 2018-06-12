require('dotenv').config();
const Discord = require('discord.js');

const knex = require('./knex');
const utils = require('./modules/utils');

const client = new Discord.Client();

const token = process.env.DISCORD_TOKEN;

const start = async () => {
  utils.migrateLatest(knex).then(async () => {
    const wisdoms = await knex('wisdoms').select('id');
    const ismoQuotes = await knex('ismo_quotes').select('id');
    if (wisdoms.length === 0 || ismoQuotes.length === 0) {
      return utils.runSeeds(knex);
    }
  });
};

start();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (!message.author.bot || message.content === 'rip in rip') {
    if (utils.computerSaysNo()) {
      const username = message.author.username;
      message.channel.send(`${username} pls`);
    } else {
      utils.handleMessage(message);
    }
  }
});

client.login(token);
