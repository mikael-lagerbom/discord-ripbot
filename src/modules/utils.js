const path = require('path');

const MersenneTwister = require('mersenne-twister');
const voca = require('voca');

const catfacts = require('./catfacts');
const decide = require('./decide');
const frustrations = require('./frustrations');
const ismo = require('./ismo_quotes');
const rips = require('./rips');
const roll = require('./roll');
const slap = require('./slap');
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
  switch (messageContent[0]) {
    case '!addrip':
      rips.addRip(message);
      break;
    case '!delrip':
      rips.delRip(message);
      break;
    case '!decide':
      decide.decide(message);
      break;
    case '!roll!':
      roll.roll(message, messageWords, generator);
      break;
    case '!ismo':
      ismo.getQuote(message);
      break;
    case '!viisaus':
      wisdoms.getWisdom(message);
      break;
    case '!kissefakta':
      catfacts.getCatfact(message);
      break;
    case '!slap':
      slap.slap(message);
      break;
    case '!rips':
      rips.ripCount(message);
      break;
    case '!vituttaa':
      frustrations.getFrustration(message, 'vituttaa');
      break;
    case '!tunteisiin':
      frustrations.getFrustration(message, 'menee tunteisiin');
      break;
    default:
      if (isInArray(messageWords, 'rip')) {
        rips.getRip(message);
      }
  }
};

module.exports = { migrateLatest, runSeeds, isInArray, computerSaysNo, handleMessage };
