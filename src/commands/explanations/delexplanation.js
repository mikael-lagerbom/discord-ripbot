const { SlashCommandBuilder } = require('discord.js');

const explanations = require('../../modules/explain');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unexplain')
    .setDescription('Deletes a saved explanation.')
    .addStringOption(option =>
      option
        .setName('term')
        .setDescription("The term that's been explained.")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const explanation = await explanations.delExplanation(interaction.guild, interaction.options.getString('term'));
      await interaction.reply(`deleted explanation for \`${explanation.key}\``);
    } catch (err) {
      console.log(err);
      await interaction.reply({ content: err.message, ephemeral: true });
    }
  }
};
