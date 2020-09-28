const voca = require('voca');

const knex = require('../knex');

const helpers = require('./helpers');
const guilds = require('./guilds');
const users = require('./users');

// '!quote '
const parseNameQuery = message =>
  voca.slice(
    message.content,
    7,
    voca.indexOf(message.content, ':') != -1 ? voca.indexOf(message.content, ':') : message.content.length
  );

const getQuote = async message => {
  let name = parseNameQuery(message).trim();
  if (name == 'random') name = '.*';
  const search = voca.indexOf(message.content, ':') != -1 ? parseQuote(message) : null;
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

// '!quote '
const parseNameAdd = (message, index) => voca.slice(message.content, index, voca.indexOf(message.content, ':'));

// ': '
const parseQuote = message =>
  voca.slice(message.content, voca.indexOf(message.content, ':') + 2, message.content.length);

const addQuote = async message => {
  if (voca.indexOf(message.content, ':') == -1) {
    message.channel.send('try pls');
    return null;
  }

  const name = parseNameAdd(message, 7).trim();
  if (name == 'random') {
    message.channel.send('try pls');
    return null;
  }
  const quote = parseQuote(message);
  if (name && quote) {
    if (quote.length > 500) message.channel.send('quote is too long');
    else if (name.length > 100) message.channel.send('name is too long');
    else {
      const guildId = await guilds.getGuildId(message);
      if (!guildId) return null;

      const authorId = await users.getUserId(message.author);

      await knex('quotes').insert({
        quote,
        name,
        user: authorId,
        guild: guildId
      });
      message.react('✅');
    }
  } else {
    message.channel.send('try pls');
  }
};

// '!delquote '
const parseDeleteId = message => voca.slice(message.content, 10, message.content.length);

const delQuote = async message => {
  const key = parseDeleteId(message);
  const guildId = await guilds.getGuildId(message);
  if (!guildId) return null;
  if (isNaN(key)) return null;

  const [keyExists] = await knex('quotes')
    .select('id')
    .where('id', key)
    .andWhere('guild', guildId);

  if (keyExists) {
    await knex('quotes')
      .del()
      .where('id', keyExists.id);

    message.react('✅');
  } else {
    message.channel.send(`i didn't find quote with id ${key}`);
  }
};

const quoteCount = async message => {
  if (message.content.length == 7) {
    const guildId = await guilds.getGuildId(message);
    if (!guildId) return null;

    const result = await knex('quotes')
      .count('*')
      .where('guild', guildId);
    const numberArray = [...(result[0].count + '')].map(n => parseInt(n));
    for (const number of numberArray) {
      const emoji = helpers.getKeyByValue(helpers.emojis, number);
      await message.react(emoji);
    }
  } else quoteCountByName(message);
};

const quoteCountByName = async message => {
  const guildId = await guilds.getGuildId(message);
  if (!guildId) return null;
  const name = voca.slice(message.content, 8, message.content.length);

  const result = await knex('quotes')
    .count('*')
    .where('guild', guildId)
    .andWhereRaw('LOWER(name) LIKE ?', name.toLowerCase());

  const numberArray = [...(result[0].count + '')].map(n => parseInt(n));
  for (const number of numberArray) {
    const emoji = helpers.getKeyByValue(helpers.emojis, number);
    await message.react(emoji);
  }
};

module.exports = { getQuote, addQuote, delQuote, quoteCount, quoteCountByName };
