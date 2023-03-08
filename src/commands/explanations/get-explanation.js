const { SlashCommandBuilder } = require('discord.js');

const explanations = require('../../modules/explain');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('explain')
    .setDescription('Explains the given term, or gives a random one if no term is specified.')
    .addStringOption(option => option.setName('term').setDescription('The term you want explained.')),
  async execute(interaction) {
    try {
      const term = interaction.options.getString('term');
      let explanation;
      if (term) {
        explanation = await explanations.getExplanation(interaction.guild, interaction.options.getString('term'));
      } else {
        explanation = await explanations.getRandomExplanation(interaction.guild);
      }
      await interaction.reply(`${explanation.key}: ${explanation.explanation}`);
    } catch (err) {
      console.log(err);
      await interaction.reply({ content: err.message, ephemeral: true });
    }
  }
};
