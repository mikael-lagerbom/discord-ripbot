const { SlashCommandBuilder } = require('discord.js');

const rips = require('../../modules/rips');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delrip')
    .setDescription('Deletes a saved rip.')
    .addStringOption(option =>
      option
        .setName('rip')
        .setDescription('The rip to delete.')
        .setMaxLength(256)
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const result = await rips.delRip(interaction.options.getString('rip'), interaction.guild, interaction.member);
      await interaction.reply(`deleted \`${result}\``);
    } catch (err) {
      console.log(err);
      await interaction.reply({ content: err.message, ephemeral: true });
    }
  }
};
