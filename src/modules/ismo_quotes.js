const knex = require('../knex');

const getQuote = async message =>
  message.channel.send(
    await knex('ismo_quotes')
      .pluck('quote')
      .orderByRaw('random()')
      .limit(1)
  );

module.exports = { getQuote };
