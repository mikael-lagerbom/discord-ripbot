const fs = require('fs');
const path = require('path');

exports.seed = (knex, Promise) => {
  const ripFile = fs.readFileSync(path.resolve(__dirname, '../../data/rip.txt'), { encoding: 'utf8' });
  const ripArray = ripFile.split('\n');
  const ripObjects = ripArray.map(rip => {
    return { rip };
  });
  return knex('rips').insert(ripObjects);
};
