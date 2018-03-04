require('dotenv').config();
const Discord = require('discord.js');

const knex = require('./knex');
const utils = require('./modules/utils');
const wisdoms = require('./modules/wisdom');

const client = new Discord.Client();

const token = process.env.DISCORD_TOKEN;

const start = async () => {
  utils.migrateLatest(knex).then(async () => {
    const wisdoms = await knex('wisdoms').select('id');
    // Only seed if DB is empty
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
  const messageWords = message.content.split(' ');
  if (utils.isInArray(messageWords, 'viisaus')) {
    const wisdom = await knex('wisdoms')
      .pluck('wisdom')
      .orderByRaw('random()')
      .limit(1);
    message.channel.send(wisdom);
  }
});

client.login(token);
