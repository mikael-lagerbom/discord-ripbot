const voca = require('voca');

const knex = require('../knex');

const guilds = require('./guilds');
const users = require('./users');

// '!quote '
const parseNameQuery = message => voca.slice(message.content, 7, message.content.length);

const getQuote = async message => {
  const name = parseNameQuery(message);
  const guildId = await guilds.getGuildId(message);
  if (!guildId) return null;

  let quoteExists = null;

  if (name) {
    [quoteExists] = await getName(name, guildId);

    if (!quoteExists) {
      message.channel.send(`i don't know what ${name} has said`);
    } else {
      const [quote] = await knex('quotes')
        .pluck('quote')
        .where('guild', guildId)
        .andWhereRaw('LOWER(name) LIKE ?', name.toLowerCase())
        .orderByRaw('random()')
        .limit(1);
      if (quote) message.channel.send(`${quote} -${name}`);
      else message.channel.send('no quotes found');
    }
  } else {
    const [quote] = await knex('quotes')
      .select('quote', 'name')
      .where('guild', guildId)
      .orderByRaw('random()')
      .limit(1);
    if (quote) message.channel.send(`${quote.quote} -${quote.name}`);
    else message.channel.send('no quotes found');
  }
};

const getName = async (name, guild) => {
  return knex('quotes')
    .select('id', 'name')
    .whereRaw('LOWER(name) LIKE ?', name.toLowerCase())
    .andWhere('guild', guild);
};

// '!addquote '
const parseNameAdd = message => voca.slice(message.content, 10, voca.indexOf(message.content, ':'));

// ': '
const parseQuote = message =>
  voca.slice(message.content, voca.indexOf(message.content, ':') + 2, message.content.length);

const addQuote = async message => {
  if (voca.indexOf(message.content, ':') == -1) {
    message.channel.send('try pls');
    return null;
  }

  const name = parseNameAdd(message);
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

module.exports = { getQuote, addQuote };
