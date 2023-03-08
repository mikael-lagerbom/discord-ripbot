const { SlashCommandBuilder } = require('discord.js');

const quotes = require('../../modules/quotes');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
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
        .setDescription('The the thing the person said.')
        .setMinLength(2)
        .setMaxLength(512)
        .setRequired(true)
    ),
  async execute(interaction) {
    const name = interaction.options.getString('name');
    const quote = interaction.options.getString('quote');

    try {
      await quotes.addQuote(name, quote, interaction.guild, interaction.member);
      await interaction.reply(`saved quote from \`${name}: ${quote}\``);
    } catch (err) {
      console.log(err);
      await interaction.reply(err.message);
    }
  }
};
