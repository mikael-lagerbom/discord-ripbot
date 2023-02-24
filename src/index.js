require('dotenv').config();
const { Client, Events, GatewayIntentBits } = require('discord.js');

const knex = require('./knex');
const utils = require('./modules/utils');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ]
});

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

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async message => {
  if (!message.author.bot) {
    if (await utils.computerComments()) {
      const username = message.author.username;
      message.channel.send(`${username} pls`);
    } else {
      utils.handleMessage(message);
    }
  }
});

client.on('error', error => {
  console.error('The WebSocket encountered an error:', error);
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
