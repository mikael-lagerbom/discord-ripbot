const Discord = require('discord.js');

const knex = require('./knex');
const utils = require('./modules/utils');
const wisdoms = require('./modules/wisdom');

const client = new Discord.Client();

const token = process.env.DISCORD_TOKEN;

const start = async () => {
  await utils.migrateLatest(knex);
  console.log('mirations ran');
};

start();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', async message => {
  console.log(message.author);
  console.log(message.channel);
  const messageWords = message.content.split(' ');
  if (utils.isInArray(messageWords, 'ping')) {
    message.channel.send('pong');
  }
});

client.login(token);
