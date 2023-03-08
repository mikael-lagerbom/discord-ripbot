const knex = require('../knex');

const guilds = require('./guilds');
const users = require('./users');

const getQuote = async message => {
  let name = parseNameQuery(message).trim();
  if (name == 'random') name = '.*';
  const guildId = await guilds.getGuildId(message);
  if (!guildId) return null;
  if (name) {
    if (search) {
      const [quote] = await knex('quotes')
        .select('quote', 'name', 'id')
        .where('guild', guildId)
        .andWhereRaw('LOWER(name) ~ ?', name.toLowerCase())
        .andWhereRaw("LOWER(quote) LIKE '%' || ? || '%'", search.toLowerCase())
        .orderByRaw('random()')
        .limit(1);
      if (quote) message.channel.send(`${quote.quote}  -${quote.name}  #${quote.id}`);
      else message.channel.send('no quote found');
    } else {
      const [quote] = await knex('quotes')
        .select('quote', 'name', 'id')
        .where('guild', guildId)
        .andWhereRaw('LOWER(name) LIKE ?', name.toLowerCase())
        .orderByRaw('random()')
        .limit(1);
      if (quote) message.channel.send(`${quote.quote}  -${quote.name}  #${quote.id}`);
      else message.channel.send('no quotes found');
    }
  } else {
    const [quote] = await knex('quotes')
      .select('quote', 'name', 'id')
      .where('guild', guildId)
      .orderByRaw('random()')
      .limit(1);
    if (quote) message.channel.send(`${quote.quote}  -${quote.name}  #${quote.id}`);
    else message.channel.send('no quotes found');
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
