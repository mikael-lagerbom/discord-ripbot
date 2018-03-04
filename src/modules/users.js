const knex = require('../knex');

const getUserId = async author => {
  const [userId] = await knex('users')
    .pluck('id')
    .where('discord_id', author.id);

  if (!userId) {
    const [userId] = await knex('users')
      .insert({
        discord_id: author.id,
        username: author.username,
        discriminator: author.discriminator
      })
      .returning('id');
    return userId;
  }
  return userId;
};

module.exports = { getUserId };
