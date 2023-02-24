const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

const getCatfact = () => axios.get('https://catfact.ninja/fact');

module.exports = {
  data: new SlashCommandBuilder().setName('catfact').setDescription('Replies with a random cat fact.'),
  async execute(interaction) {
    const catfact = await getCatfact();
    await interaction.reply(catfact.data.fact);
  }
};
