const fs = require('node:fs');
const path = require('node:path');

const MersenneTwister = require('mersenne-twister');
const voca = require('voca');

const rips = require('./modules/rips');

const seed = Date.now();
const generator = new MersenneTwister(seed);

const getAllFiles = (dirPath, arrayOfFiles) => {
  files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, `${dirPath}/${file}`));
    }
  });

  return arrayOfFiles.filter(file => file.endsWith('.js'));
};

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
  // Words without separators, for triggers
  const messageWords = voca.words(message.content.toLowerCase());
  message.content = message.content.replace(/\s+/g, ' ').trim();

  if (isInArray(messageWords, 'rip')) {
    const rip = await rips.getRip(message);
    message.reply(`rip in ${rip}`);
  } else if (await computerComments()) {
    message.reply(`tää :D`);
  }
};

const computerReview = async message => {
  const roll = Math.floor(generator.random_incl() * 2);
  if (roll === 0) {
    message.react('➕');
  } else if (roll === 1) {
    message.react('➖');
  }
}

module.exports = { getAllFiles, migrateLatest, runSeeds, isInArray, computerComments, handleMessage, computerReview };
