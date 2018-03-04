require('dotenv').config();
const Discord = require('discord.js');

const knex = require('./knex');
const utils = require('./modules/utils');
const rips = require('./modules/rips');
const wisdoms = require('./modules/wisdoms');

const client = new Discord.Client();

const token = process.env.DISCORD_TOKEN;

const start = async () => {
  utils.migrateLatest(knex).then(async () => {
    const wisdoms = await knex('wisdoms').select('id');
    if (wisdoms.length === 0) {
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
    const messageWords = message.content.split(' ');
    if (utils.isInArray(messageWords, 'viisaus')) {
      const wisdom = await wisdoms.getWisdom();
      message.channel.send(wisdom);
    }
    if (utils.isInArray(messageWords, 'rip')) {
      const rip = await rips.getRip();
      message.channel.send(`rip in ${rip}`);
    }
  }
});

client.login(token);
