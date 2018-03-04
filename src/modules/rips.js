const voca = require('voca');

const knex = require('../knex');

const guilds = require('./guilds');
const users = require('./users');

const getRip = async () =>
  knex('rips')
    .pluck('rip')
    .orderByRaw('random()')
    .limit(1);

const getSpecificRip = async rip =>
  knex('rips')
    .pluck('id')
    .where('rip', rip);

const parseRipText = message => voca.splice(message, 0, 8);

const addRip = async message => {
  const ripText = parseRipText(message.content);
  const [ripExists] = await getSpecificRip(ripText);
  if (!ripExists) {
    const authorId = await users.getUserId(message.author);
    const guildId = await guilds.getGuildId(message.channel.guild);
    await knex('rips').insert({
      rip: ripText,
      user: authorId,
      guild: guildId
    });
    message.channel.send(`"${ripText}" lisätty rippien listaan`);
  } else {
    message.channel.send(`"${ripText}" on jo listassa`);
  }
};

const delRip = async message => {
  const ripText = parseRipText(message.content);
  const [ripExists] = await getSpecificRip(ripText);
  if (ripExists) {
    await knex('rips')
      .del()
      .where('rip', ripText);
    message.channel.send(`"${ripText}" poistettu rippien listasta`);
  } else {
    message.channel.send(`"${ripText}" ei ole rippien listassa`);
  }
};

module.exports = { getRip, addRip, delRip };
