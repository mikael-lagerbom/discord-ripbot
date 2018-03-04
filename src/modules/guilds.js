const knex = require('../knex');

const getGuildId = async guild => {
  const [guildId] = await knex('guilds')
    .pluck('id')
    .where('discord_id', guild.id);

  if (!guildId) {
    const [guildId] = await knex('guilds')
      .insert({
        discord_id: guild.id,
        name: guild.name
      })
      .returning('id');

    return guildId;
  }
  return guildId;
};

module.exports = { getGuildId };
