const knex = require('../knex');

const getWisdom = async () =>
  knex('wisdoms')
    .pluck('wisdom')
    .orderByRaw('random()')
    .limit(1);

module.exports = { getWisdom };
