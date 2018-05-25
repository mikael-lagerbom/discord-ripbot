const knex = require('../knex');

const guilds = require('./guilds');
const users = require('./users');

const slap = async message => {
  const messageWords = message.content.split(' ');

  if (message.content.indexOf('@everyone') > -1 || message.content.indexOf('@here') > -1) {
    message.channel.send('älä oo perseestä');
  } else if (messageWords.length > 2) {
    message.channel.send('älä haukkaa enempää kun voit niellä');
  } else {
    const guildId = await guilds.getGuildId(message.channel.guild);
    const slapperId = await users.getUserId(message.author);

    const mentions = message.mentions.users;
    const slappee = mentions.first();

    if (slappee && slappee.id) {
      const slappeeDatabaseId = await users.getUserId({
        id: slappee.id,
        username: slappee.username,
        discriminator: slappee.discriminator
      });

      const slap = await knex('slaps')
        .insert({
          slapper: slapperId,
          slappee: slappeeDatabaseId,
          guild: guildId
        })
        .returning('id');

      message.channel.send(`${message.author.username} slaps <@${slappee.id}> around a bit with a large trout`);
      message.delete();
    } else {
      message.channel.send('läpsi nyt jotain perkele');
    }
  }
};

module.exports = { slap };
