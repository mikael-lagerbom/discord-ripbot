const fs = require('fs');
const path = require('path');

exports.seed = async (knex, Promise) => {
  const wisdomFile = fs.readFileSync(path.resolve(__dirname, '../../data/wisdoms.txt'), { encoding: 'utf8' });
  const wisdomArray = wisdomFile.split('\n');
  const wisdomObjects = wisdomArray.map(wisdom => {
    return { wisdom };
  });
  return knex('wisdoms').insert(wisdomObjects);
};
