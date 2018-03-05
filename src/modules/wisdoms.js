const knex = require('../knex');

const getWisdom = async message =>
  message.channel.send(
    await knex('wisdoms')
      .pluck('wisdom')
      .orderByRaw('random()')
      .limit(1)
  );

module.exports = { getWisdom };
