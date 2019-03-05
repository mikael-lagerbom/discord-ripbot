const path = require('path');

const MersenneTwister = require('mersenne-twister');
const voca = require('voca');

const affixes = require('./affixes');
const assaults = require('./assaults');
const catfacts = require('./catfacts');
const decide = require('./decide');
const explanations = require('./explain');
const help = require('./help');
const ismo = require('./ismo_quotes');
const quotes = require('./quotes');
const rips = require('./rips');
const roll = require('./roll');

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

// Filthy hack to fix rolling
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const computerComments = async () => {
  // adjust for fewer applications
  await delay(200);
  const maxRand = 75;
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
    case '!roll':
      roll.roll(message, messageWords, generator);
      break;
    case '!ismo':
      ismo.getQuote(message);
      break;
    case '!catfact':
      catfacts.getCatfact(message);
      break;
    case '!rips':
      rips.ripCount(message);
      break;
    case '!learn':
      explanations.addExplanation(message);
      break;
    case '!forget':
      explanations.delExplanation(message);
      break;
    case '?explanations':
      explanations.listExplanations(message);
      break;
    case '?terms':
      explanations.listTerms(message);
      break;
    case '?files':
      explanations.listImages(message);
      break;
    case '?links':
      explanations.listUrls(message);
      break;
    case '!help':
      help.sendHelp(message);
      break;
    case '!quote':
      quotes.addQuote(message);
      break;
    case '?quote':
      quotes.getQuote(message);
      break;
    case '!affixes':
      affixes.affixes(message, ...messageWords.slice(1));
      break;
    case '!assault':
      assaults.assault(message);
      break;
    case '?random':
      explanations.getRandomExplanation(message);
      break;
    default:
      if (message.content[0] === '?' && message.content.length > 1) {
        explanations.getExplanation(message, messageWords);
      } else if (isInArray(messageWords, 'rip')) {
        rips.getRip(message);
      } else if (await utils.computerComments()) {
        message.channel.send(`tää :D`);
      }
  }
};

module.exports = { migrateLatest, runSeeds, isInArray, computerComments, handleMessage };
