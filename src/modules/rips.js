const knex = require('../knex');

const guilds = require('./guilds');
const users = require('./users');

const getRip = async message => {
  const guildId = await guilds.getGuildId(message.guild);
  if (!guildId) return null;

  return knex('rips')
    .pluck('rip')
    .where('guild', guildId)
    .orderByRaw('random()')
    .limit(1);
};

const getSpecificRip = async (rip, guild) => {
  return knex('rips')
    .select('id', 'rip')
    .where('rip', rip)
    .andWhere('guild', guild);
};

const addRip = async (rip, guild, member) => {
  if (rip.length > 256) throw Error('rip is too long');
  else if (rip.indexOf('@') > -1) throw Error("don't be an ass");
  else {
    const guildId = await guilds.getGuildId(guild);

    const [ripExists] = await getSpecificRip(rip, guildId);

    if (ripExists) {
      throw Error(`"${ripExists.rip}" is already saved`);
    }

    const authorId = await users.getUserId(member);

    const [result] = await knex('rips')
      .insert({
        rip: rip,
        user: authorId,
        guild: guildId
      })
      .returning('rip');

    return result.rip;
  }
};

const delRip = async (rip, guild) => {
  const guildId = await guilds.getGuildId(guild);
  if (!guildId) return null;

  const [ripExists] = await getSpecificRip(rip, guildId);

  if (ripExists) {
    const [result] = await knex('rips')
      .del()
      .where('id', ripExists.id)
      .returning('rip');

    return result.rip;
  } else {
    throw Error(`couldn't find \`${rip}\``);
  }
};

const ripCount = async guild => {
  const guildId = await guilds.getGuildId(guild);
  if (!guildId) return null;

  const [result] = await knex('rips')
    .count('*')
    .where('guild', guildId);

  return result.count;
};

module.exports = { getRip, addRip, delRip, ripCount };
