const path = require('path');

const isInArray = (array, string) => {
  return array.indexOf(string.toLowerCase()) > -1;
};

const migrateLatest = knex => {
  knex.migrate.latest({
    directory: path.resolve(__dirname, '../migrations')
  });
};

module.exports = { isInArray, migrateLatest };
