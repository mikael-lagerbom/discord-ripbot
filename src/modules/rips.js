const voca = require('voca');

const knex = require('../knex');

const guilds = require('./guilds');
const users = require('./users');

const getRip = async message => {
  const guildId = await guilds.getGuildId(message.channel.guild);
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
    const guildId = await guilds.getGuildId(message.channel.guild);

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
  const guildId = await guilds.getGuildId(message.channel.guild);

  const [ripExists] = await getSpecificRip(ripText, guildId);

  if (ripExists) {
    const rip = await knex('rips')
      .del()
      .where('id', ripExists.id)
      .returning('rip');

    message.channel.send(`"${rip}" poistettu rippien listasta`);
  } else {
    message.channel.send(`"${ripText}" ei ole rippien listassa`);
  }
};

module.exports = { getRip, addRip, delRip };
