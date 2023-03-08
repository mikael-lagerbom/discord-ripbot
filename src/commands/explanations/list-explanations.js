const { SlashCommandBuilder } = require('discord.js');

const explanations = require('../../modules/explain');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('explanations')
    .setDescription('Lists explanations.')
    .addStringOption(option =>
      option
        .setName('type')
        .setDescription('The type of explanations to list.')
        .addChoices(
          { name: 'all', value: 'all' },
          { name: 'text', value: 'text' },
          { name: 'link', value: 'url' },
          { name: 'image', value: 'image' }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const list = await explanations.listExplanations(interaction.guild, interaction.options.getString('type'));
      await interaction.reply({ content: list, ephemeral: true });
    } catch (err) {
      console.log(err);
      await interaction.reply({ content: err.message, ephemeral: true });
    }
  }
};
