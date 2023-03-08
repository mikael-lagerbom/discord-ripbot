const { SlashCommandBuilder } = require('discord.js');

const quotes = require('../../modules/quotes');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addquote')
    .setDescription('Adds a new quote.')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('The person who said the thing.')
        .setMinLength(2)
        .setMaxLength(100)
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('quote')
        .setDescription('The thing the person said.')
        .setMinLength(2)
        .setMaxLength(512)
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const quote = await quotes.addQuote(
        interaction.options.getString('name'),
        interaction.options.getString('quote'),
        interaction.guild,
        interaction.member
      );
      await interaction.reply(`saved quote from \`${quote.name}: ${quote.quote} #${quote.id}\``);
    } catch (err) {
      console.log(err);
      await interaction.reply(err.message);
    }
  }
};
