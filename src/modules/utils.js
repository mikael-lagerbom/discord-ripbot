const path = require('path');

const voca = require('voca');

const catfacts = require('./catfacts');
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
  // Words with separators, for commands
  const messageContent = message.content.toLowerCase().split(' ');
  // Words without separators, for triggers
  const messageWords = voca.words(message.content.toLowerCase());
  if (messageContent[0] === '!addrip') {
    rips.addRip(message);
  } else if (messageContent[0] === '!delrip') {
    rips.delRip(message);
  } else {
    if (isInArray(messageWords, 'viisaus')) {
      wisdoms.getWisdom(message);
    }
    if (isInArray(messageWords, 'rip')) {
      rips.getRip(message);
    }
    if (isInArray(messageWords, 'kissefakta')) {
      catfacts.getCatfact(message);
    }
  }
};

module.exports = { migrateLatest, runSeeds, isInArray, handleMessage };
