const Discord = require('discord.js');

const utils = require('./modules/utils');
const wisdoms = require('./modules/wisdom');

const client = new Discord.Client();

const token = process.env.DISCORD_TOKEN;

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  const messageWords = message.content.split('((\b[^s]+\b)((?<=.w).)?)');
  if (utils.isInArray(messageWords, 'ping')) {
    message.channel.send('pong');
  }
});

client.login(token);
