const { SlashCommandBuilder } = require('discord.js');

const rips = require('../../modules/rips');

module.exports = {
  data: new SlashCommandBuilder().setName('rips').setDescription('Replies with the amount of saved rips.'),
  async execute(interaction) {
    const result = await rips.ripCount(interaction.guild);
    await interaction.reply(`${result} rips saved.`);
  }
};
