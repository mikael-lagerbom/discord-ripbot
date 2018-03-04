const path = require('path');

const rips = require('./rips');
const wisdoms = require('./wisdoms');

const migrateLatest = knex => {
  return knex.migrate.latest({
    directory: path.resolve(__dirname, '../migrations')
  });
};

const runSeeds = knex => {
  return knex.seed.run({
    directory: path.resolve(__dirname, '../seeds')
  });
};

const isInArray = (array, string) => {
  return array.indexOf(string.toLowerCase()) > -1;
};

const handleMessage = async message => {
  const messageWords = message.content.split(' ');
  if (isInArray(messageWords, 'viisaus')) {
    const wisdom = await wisdoms.getWisdom();
    message.channel.send(wisdom);
  }
  if (isInArray(messageWords, 'rip')) {
    const rip = await rips.getRip();
    message.channel.send(`rip in ${rip}`);
  }
};

module.exports = { migrateLatest, runSeeds, isInArray, handleMessage };
