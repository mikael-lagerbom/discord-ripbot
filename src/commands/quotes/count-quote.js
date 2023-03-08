const { SlashCommandBuilder } = require('discord.js');

const quotes = require('../../modules/quotes');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quotes')
    .setDescription('Replies with the amount of saved quotes.')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('Include name, if you want the amount of quotes saved for that person.')
        .setMinLength(2)
        .setMaxLength(100)
    ),
  async execute(interaction) {
    try {
      const name = interaction.options.getString('name');
      if (name) {
        const count = await quotes.quoteCountByName(interaction.guild, name);
        await interaction.reply(`${name} has been quoted \`${count}\` times.`);
      } else {
        const count = await quotes.quoteCount(interaction.guild);
        await interaction.reply(`server has \`${count}\` quotes saved.`);
      }
    } catch (err) {
      console.log(err);
      await interaction.reply({ content: err.message, ephemeral: true });
    }
  }
};
