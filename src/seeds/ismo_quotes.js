const fs = require('fs');
const path = require('path');

exports.seed = async (knex, Promise) => {
  const quoteFile = fs.readFileSync(path.resolve(__dirname, '../../data/ismo.txt'), { encoding: 'utf8' });
  const quoteArray = quoteFile.split('\n');
  const quoteObjects = quoteArray.map(quote => {
    return { quote };
  });
  return knex('ismo_quotes').insert(quoteObjects);
};
