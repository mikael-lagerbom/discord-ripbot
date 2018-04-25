const path = require('path');

const MersenneTwister = require('mersenne-twister');
const voca = require('voca');

const catfacts = require('./catfacts');
const decide = require('./decide');
const ismo = require('./ismo_quotes');
const rips = require('./rips');
const roll = require('./roll');
const wisdoms = require('./wisdoms');

const seed = Date.now();
const generator = new MersenneTwister(seed);

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

const computerSaysNo = () => {
  // adjust for fewer applications
  const maxRand = 100;
  const plsTrigger = Math.floor(maxRand / 2);
  const randInt = Math.floor(generator.random_incl() * Math.floor(maxRand));
  return randInt === plsTrigger;
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
  } else if (messageContent[0] === '!decide') {
    decide.decide(message);
  } else if (messageContent[0] === '!roll') {
    roll.roll(message, messageWords, generator);
  } else if (messageContent[0] === '!ismo') {
    ismo.getQuote(message);
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

module.exports = { migrateLatest, runSeeds, isInArray, computerSaysNo, handleMessage };
