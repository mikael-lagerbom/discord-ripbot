const path = require('path');

const MersenneTwister = require('mersenne-twister');
const voca = require('voca');

const decide = require('./modules/decide');
const answers = require('./modules/eightball');
const explanations = require('./modules/explain');
const help = require('./modules/help');
const quotes = require('./modules/quotes');
const rips = require('./modules/rips');

const seed = Date.now();
const generator = new MersenneTwister(seed);

const migrateLatest = knex => {
  return knex.migrate.latest({
    directory: path.resolve(__dirname, './migrations')
  });
};

const runSeeds = knex => {
  return knex.seed.run({
    directory: path.resolve(__dirname, './seeds')
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
  // const messageContent = message.content.toLowerCase().split(' ');
  // Words without separators, for triggers
  const messageWords = voca.words(message.content.toLowerCase());
  message.content = message.content.replace(/\s+/g, ' ').trim();

  if (isInArray(messageWords, 'rip')) {
    rips.getRip(message);
  } else if (await computerComments()) {
    message.channel.send(`tää :D`);
  }
  // switch (messageContent[0]) {
  //   case '!rip':
  //     rips.addRip(message);
  //     break;
  //   case '!delrip':
  //     rips.delRip(message);
  //     break;
  //   case '?decide':
  //     decide.decide(message);
  //     break;
  //   case '?rips':
  //     rips.ripCount(message);
  //     break;
  //   case '!learn':
  //     explanations.addExplanation(message);
  //     break;
  //   case '!forget':
  //     explanations.delExplanation(message);
  //     break;
  //   case '?explanations':
  //     explanations.listExplanations(message);
  //     break;
  //   case '?terms':
  //     explanations.listTerms(message);
  //     break;
  //   case '?files':
  //     explanations.listImages(message);
  //     break;
  //   case '?links':
  //     explanations.listUrls(message);
  //     break;
  //   case '!help':
  //     help.sendHelp(message);
  //     break;
  //   case '!quote':
  //     quotes.addQuote(message);
  //     break;
  //   case '!delquote':
  //     quotes.delQuote(message);
  //     break;
  //   case '?quote':
  //     quotes.getQuote(message);
  //     break;
  //   case '?quotes':
  //     quotes.quoteCount(message);
  //     break;
  //   case '?random':
  //     explanations.getRandomExplanation(message);
  //     break;
  //   case '?kasipallo':
  //     answers.answer(message, messageWords, generator);
  //     break;
  //   default:
  // if (message.content[0] === '?' && message.content.length > 1) {
  //   explanations.getExplanation(message, messageWords);
  // } else if (isInArray(messageWords, 'rip')) {
  //   rips.getRip(message);
  // } else if (await computerComments()) {
  //   message.channel.send(`tää :D`);
  // }
  // }
};

module.exports = { migrateLatest, runSeeds, isInArray, computerComments, handleMessage };
