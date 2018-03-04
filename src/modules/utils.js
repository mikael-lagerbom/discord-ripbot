const path = require('path');

const isInArray = (array, string) => {
  return array.indexOf(string.toLowerCase()) > -1;
};

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

module.exports = { isInArray, migrateLatest, runSeeds };
