const knex = require('../knex');

const getGuildId = async discordGuild => {
  if (!discordGuild) {
    return new Error("Guild-specific commands can't be used in private chats");
  }
  const [guildId] = await knex('guilds')
    .pluck('id')
    .where('discord_id', discordGuild.id);

  if (!guildId) {
    const [guildId] = await knex('guilds')
      .insert({
        discord_id: discordGuild.id,
        name: discordGuild.name
      })
      .returning('id');

    return guildId;
  }
  return guildId;
};

module.exports = { getGuildId };
