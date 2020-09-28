const voca = require('voca');

const knex = require('../knex');

const helpers = require('./helpers');
const guilds = require('./guilds');
const users = require('./users');

const getRip = async message => {
  const guildId = await guilds.getGuildId(message);
  if (!guildId) return null;

  const rip = await knex('rips')
    .pluck('rip')
    .where('guild', guildId)
    .orderByRaw('random()')
    .limit(1);
  message.channel.send(`rip in ${rip}`);
};

const getSpecificRip = async (rip, guild) => {
  return knex('rips')
    .select('id', 'rip')
    .where('rip', rip)
    .andWhere('guild', guild);
};

const parseRipText = (message, index) => voca.splice(message, 0, index);

const addRip = async message => {
  const ripText = parseRipText(message.content, 5);
  if (ripText.length > 200) message.channel.send('rip is too long');
  else if (ripText.indexOf('@') > -1) message.channel.send("don't be an ass");
  else {
    const guildId = await guilds.getGuildId(message);
    if (!guildId) return null;

    const [ripExists] = await getSpecificRip(ripText, guildId);

    if (!ripExists) {
      const authorId = await users.getUserId(message.author);

      await knex('rips')
        .insert({
          rip: ripText,
          user: authorId,
          guild: guildId
        })
        .returning('rip');

      message.react('✅');
    } else {
      message.channel.send(`"${ripExists.rip}" is already saved`);
    }
  }
};

const delRip = async message => {
  const ripText = parseRipText(message.content, 8);
  const guildId = await guilds.getGuildId(message);
  if (!guildId) return null;

  const [ripExists] = await getSpecificRip(ripText, guildId);

  if (ripExists) {
    const rip = await knex('rips')
      .del()
      .where('id', ripExists.id)
      .returning('rip');

    message.react('✅');
  } else {
    message.channel.send(`"${ripText}" isn't saved`);
  }
};

const ripCount = async message => {
  const guildId = await guilds.getGuildId(message);
  if (!guildId) return null;

  const result = await knex('rips')
    .count('*')
    .where('guild', guildId);
  const numberArray = [...(result[0].count + '')].map(n => parseInt(n));
  for (const number of numberArray) {
    const emoji = helpers.getKeyByValue(helpers.emojis, number);
    await message.react(emoji);
  }
};

module.exports = { getRip, addRip, delRip, ripCount };
