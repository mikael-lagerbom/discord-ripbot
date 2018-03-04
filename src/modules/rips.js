const knex = require('../knex');

const getRip = async () =>
  knex('rips')
    .pluck('rip')
    .orderByRaw('random()')
    .limit(1);

module.exports = { getRip };
