const { SlashCommandBuilder } = require('discord.js');

const quotes = require('../../modules/quotes');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Replies with a random quote.')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('Include name, if you want a quote from that person.')
        .setMinLength(2)
        .setMaxLength(100)
    )
    .addStringOption(option =>
      option
        .setName('keyword')
        .setDescription('Include a keyword, if you want a quote including that keyword.')
        .setMinLength(2)
        .setMaxLength(100)
    ),
  async execute(interaction) {
    try {
      const quote = await quotes.getQuote(
        interaction.guild,
        interaction.options.getString('name'),
        interaction.options.getString('keyword')
      );
      await interaction.reply(`${quote.quote} -${quote.name} #${quote.id}`);
    } catch (err) {
      console.log(err);
      await interaction.reply(err.message);
    }
  }
};
