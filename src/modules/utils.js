const path = require('path');

const MersenneTwister = require('mersenne-twister');
const voca = require('voca');

const affixes = require('./affixes');
const assaults = require('./assaults');
const catfacts = require('./catfacts');
const decide = require('./decide');
const explanations = require('./explain');
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

const sendHelp = message => {
  const helpString = `
   Useable commands:
   **Rips**
   - !addrip <rip message> adds a new rip to the database
   - !delrip <rip message> deletes a rip if it exists
   - !rips reacts with the amount of rips in the database
   - rip in a message responds with a random saved rip

   **Utility**
   - !decide <option, option, option...> chooses one of the options
   - !roll <number, optional> rolls a random number between 0-100 (or given number)

   **Explanations**
   - !learn <term: explanation> saves a term and an explanation for the term
   - !learn <term: url> saves an url without the preview
   - !learn <term:> as a comment to an image saves the term and the image

   - ?<term> responds with the saved term's explanation
   - ?random responds with a random explanation
   - ?explanations sends a private message with a list of all the saved stuff
   - ?terms send a private message with a list of the terms saved
   - ?files sends a private message with a list of the images saved
   - ?links sends a private message with a list of the urls saved

   **Quotes**
   - !quote <name, optional> fetches a random quote from the person, if given, random if not
   - !addquote <name>: <quote> adds a new quote to the given person

   **WoW-stuff**
   - !affixes <region, optional> <explained, optional> gets the current affixes
   - !assault fetches the start time of the next assault, or the duration of the current one

   **Random fun**
   - !ismo responds with a random Ismo Laitela quote
   - !catfact responds with a random cat fact

   **GitHub**
   - <https://github.com/mikhepls/discord-ripbot>
   `;
  message.author.send(helpString);
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
      sendHelp(message);
      break;
    case '!addquote':
      quotes.addQuote(message);
      break;
    case '!quote':
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
      }
  }
};

module.exports = { migrateLatest, runSeeds, isInArray, computerComments, handleMessage };
