const path = require('path');

const MersenneTwister = require('mersenne-twister');
const voca = require('voca');

const affixes = require('./affixes');
const apply = require('./apply');
const assaults = require('./assaults');
const catfacts = require('./catfacts');
const decide = require('./decide');
const explanations = require('./explain');
const frustrations = require('./frustrations');
const ismo = require('./ismo_quotes');
const quotes = require('./quotes');
const requests = require('./requests');
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

const sendHelp = message => {
  const helpString = `
   Useable commands:
   - !addrip <rip message> adds a new rip to the database
   - !delrip <rip message> deletes a rip if it exists
   - !decide <option, option, option...> chooses one of the options
   - !roll <number, optional> rolls a random number between 0-100 (or given number)
   - !ismo responds with a random Ismo Laitela quote
   - !viisaus responds with a random finnish wisdom
   - !kissefakta responds with a random cat fact
   - !slap <tagged member> slaps the target and removes the command message
   - !rips reacts with the amount of rips in the database
   - !vituttaa responds with a random thing that frustrates
   - !tunteisiin same thing as !vituttaa
   - !toive gives instructions on how to contribute to the development of the bot
   - !heimotaistelu makes two people fight
   - !ruoka gives you a suggestion for food
   - !opi <term: explanation> saves a term and an explanation for the term
   - !opi <term: url> saves an url without the preview
   - !opi <term:> as a comment to an image saves the term and the image
   - !selitykset sends a private message with a list of the terms explained
   - !kuvat sends a private message with a list of the images saved
   - !linkit sends a private message with a list of the urls saved
   - !help sends a private message with this information
   - !hakemus <place to apply to> decides your fate regarding the place
   - !quote <name, optional> fetches a random quote from the person, if given, random if not
   - !addquote <name>: <quote> adds a new quote to the given person
   - !delquote, not yet implemented
   - !affixes <region, optional> <explained, optional> gets the current affixes
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
    case '!toive':
      requests.sendFeatureRequest(message);
      break;
    case '!heimotaistelu':
      requests.sendFeatureRequest(message);
      break;
    case '!ruoka':
      requests.sendFeatureRequest(message);
      break;
    case '!opi':
      explanations.addExplanation(message);
      break;
    case '!unohda':
      explanations.delExplanation(message);
      break;
    case '!selitykset':
      explanations.listExplanations(message);
      break;
    case '!kuvat':
      explanations.listImages(message);
      break;
    case '!linkit':
      explanations.listUrls(message);
      break;
    case '!help':
      sendHelp(message);
      break;
    case '!hakemus':
      apply.apply(message, messageWords, generator);
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
    default:
      if (message.content[0] === '?' && message.content.length > 1) {
        explanations.getExplanation(message, messageWords);
      } else if (isInArray(messageWords, 'rip')) {
        rips.getRip(message);
      }
  }
};

module.exports = { migrateLatest, runSeeds, isInArray, computerSaysNo, handleMessage };
