const { SlashCommandBuilder } = require('discord.js');

const quotes = require('../../modules/quotes');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delquote')
    .setDescription('Deletes a saved quote.')
    .addIntegerOption(option =>
      option
        .setName('id')
        .setDescription('The ID of the quote.')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const quote = await quotes.delQuote(interaction.guild, interaction.options.getInteger('id'));
      await interaction.reply(`deleted quote \`${quote.name}: ${quote.quote} #${quote.id}\``);
    } catch (err) {
      console.log(err);
      await interaction.reply({ content: err.message, ephemeral: true });
    }
  }
};
