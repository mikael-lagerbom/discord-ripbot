const voca = require('voca');

const knex = require('../knex');

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

const parseRipText = message => voca.splice(message, 0, 8);

const addRip = async message => {
  const ripText = parseRipText(message.content);
  if (ripText.length > 50) message.channel.send('rip on liian pitkä');
  else if (ripText.indexOf('@') > -1) message.channel.send('älä oo perseestä');
  else {
    const guildId = await guilds.getGuildId(message);
    if (!guildId) return null;

    const [ripExists] = await getSpecificRip(ripText, guildId);

    if (!ripExists) {
      const authorId = await users.getUserId(message.author);

      const rip = await knex('rips')
        .insert({
          rip: ripText,
          user: authorId,
          guild: guildId
        })
        .returning('rip');

      message.react('✅');
    } else {
      message.channel.send(`"${ripExists.rip}" on jo listassa`);
    }
  }
};

const delRip = async message => {
  const ripText = parseRipText(message.content);
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
    message.channel.send(`"${ripText}" ei ole rippien listassa`);
  }
};

const getKeyByValue = (object, value) => Object.keys(object).find(key => object[key] === value);

const ripCount = async message => {
  const emojis = {
    '\u0031\u20E3': 1,
    '\u0032\u20E3': 2,
    '\u0033\u20E3': 3,
    '\u0034\u20E3': 4,
    '\u0035\u20E3': 5,
    '\u0036\u20E3': 6,
    '\u0037\u20E3': 7,
    '\u0038\u20E3': 8,
    '\u0039\u20E3': 9,
    '\u0030\u20E3': 0
  };

  const result = await knex('rips').count('*');
  const numberArray = [...(result[0].count + '')].map(n => parseInt(n));
  for (const number of numberArray) {
    const emoji = getKeyByValue(emojis, number);
    await message.react(emoji);
  }
};

module.exports = { getRip, addRip, delRip, ripCount };
