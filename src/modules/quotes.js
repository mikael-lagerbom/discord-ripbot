const knex = require('../knex');

const guilds = require('./guilds');
const users = require('./users');

const getQuote = async (guild, name, keyword) => {
  const guildId = await guilds.getGuildId(guild);
  if (!guildId) return null;

  const [quote] = await knex('quotes')
    .select('quote', 'name', 'id')
    .where('guild', guildId)
    .andWhere(builder => {
      if (name) {
        builder.andWhereRaw('LOWER(name) ~ ?', name.toLowerCase());
      }
      if (keyword) {
        builder.andWhereRaw("LOWER(quote) LIKE '%' || ? || '%'", keyword.toLowerCase());
      }
    })
    .orderByRaw('random()')
    .limit(1);
  if (quote) {
    return quote;
  } else {
    throw new Error('no quote found');
  }
};

const addQuote = async (name, quote, guild, member) => {
  const guildId = await guilds.getGuildId(guild);
  const authorId = await users.getUserId(member);

  const [result] = await knex('quotes')
    .insert({
      quote,
      name,
      user: authorId,
      guild: guildId
    })
    .returning(['name', 'quote', 'id']);

  return result;
};

const delQuote = async (guild, id) => {
  const guildId = await guilds.getGuildId(guild);
  if (!guildId) return null;
  if (isNaN(id)) return null;

  const [keyExists] = await knex('quotes')
    .select('id')
    .where('id', id)
    .andWhere('guild', guildId);

  if (keyExists) {
    const [quote] = await knex('quotes')
      .del()
      .where('id', keyExists.id)
      .returning(['name', 'quote', 'id']);

    return quote;
  } else {
    throw new Error(`i didn't find quote with id ${id}`);
  }
};

const quoteCount = async guild => {
  const guildId = await guilds.getGuildId(guild);
  if (!guildId) return null;

  const [result] = await knex('quotes')
    .count('*')
    .where('guild', guildId);

  return result.count;
};

const quoteCountByName = async (guild, name) => {
  const guildId = await guilds.getGuildId(guild);
  if (!guildId) return null;

  const [result] = await knex('quotes')
    .count('*')
    .where('guild', guildId)
    .andWhereRaw('LOWER(name) LIKE ?', name.toLowerCase());

  return result.count;
};

module.exports = { getQuote, addQuote, delQuote, quoteCount, quoteCountByName };
