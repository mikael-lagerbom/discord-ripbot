const { SlashCommandBuilder } = require('discord.js');

const knex = require('../knex');

const getQuote = () =>
  knex('ismo_quotes')
    .pluck('quote')
    .orderByRaw('random()')
    .limit(1);

module.exports = {
  data: new SlashCommandBuilder().setName('ismo').setDescription('Replies with a random Ismo quote.'),
  async execute(interaction) {
    const [quote] = await getQuote();
    await interaction.reply(quote);
  }
};
