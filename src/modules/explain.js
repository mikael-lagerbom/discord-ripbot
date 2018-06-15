const voca = require('voca');

const knex = require('../knex');

const guilds = require('./guilds');
const users = require('./users');

// '?' <- one character
const parseQuery = message => voca.slice(message.content, 1, message.content.length);

const getExplanation = async message => {
  const key = parseQuery(message);
  const guildId = await guilds.getGuildId(message.channel.guild);

  const [keyExists] = await getKey(key, guildId);

  if (!keyExists) {
    message.channel.send(`en tiedä mitä ${key} tarkoittaa`);
  } else {
    const value = await knex('explanations')
      .pluck('explanation')
      .where('id', keyExists.id);
    message.channel.send(`${keyExists.key}: ${value}`);
  }
};

const getKey = async (key, guild) => {
  return knex('explanations')
    .select('id', 'key')
    .whereRaw('LOWER(key) LIKE ?', '%' + key.toLowerCase() + '%')
    .andWhere('guild', guild);
};

// '!opi ' <- 5 characters
const parseKey = message => voca.slice(message.content, 5, voca.indexOf(message.content, ':'));

// ': ' <- 2 characters
const parseValue = message =>
  voca.slice(message.content, voca.indexOf(message.content, ':') + 2, message.content.length);

const addExplanation = async message => {
  const key = parseKey(message);
  const value = parseValue(message);
  if (value.length > 200) message.channel.send('selitys on liian pitkä');
  else if (key.length > 100) message.channel.send('termi on liian pitkä');
  else if (message.content.indexOf('@') > -1) message.channel.send('älä oo perseestä');
  else {
    const guildId = await guilds.getGuildId(message.channel.guild);
    const authorId = await users.getUserId(message.author);

    const [keyExists] = await getKey(key, guildId);

    if (!keyExists) {
      await knex('explanations').insert({
        key,
        explanation: value,
        user: authorId,
        guild: guildId
      });

      message.react('✅');
    } else {
      await knex('explanations')
        .update({
          explanation: value,
          user: authorId
        })
        .whereRaw('LOWER(key) LIKE ?', '%' + key.toLowerCase() + '%');
      message.react('✅');
    }
  }
};

// '!unohda ' <- 8 characters
const parseForgetKey = message => voca.slice(message.content, 8, message.content.length);

const delExplanation = async message => {
  const key = parseForgetKey(message);
  const guildId = await guilds.getGuildId(message.channel.guild);

  const [keyExists] = await getKey(key, guildId);

  if (keyExists) {
    await knex('explanations')
      .del()
      .where('id', keyExists.id);

    message.react('✅');
  } else {
    message.channel.send(`en tiedä mitä ${key} tarkoittaa`);
  }
};

module.exports = { getExplanation, addExplanation, delExplanation };
