const { SlashCommandBuilder } = require('discord.js');

const rips = require('../../modules/rips');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addrip')
    .setDescription('Adds a new rip.')
    .addStringOption(option =>
      option
        .setName('rip')
        .setDescription('The thing to rip in.')
        .setMaxLength(256)
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const result = await rips.addRip(interaction.options.getString('rip'), interaction.guild, interaction.member);
      await interaction.reply(`saved \`${result}\``);
    } catch (err) {
      console.log(err);
      await interaction.reply(err.message);
    }
  }
};
