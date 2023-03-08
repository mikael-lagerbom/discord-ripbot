const { SlashCommandBuilder } = require('discord.js');

const explanations = require('../../modules/explain');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addexplain')
    .setDescription('Adds a new explanation.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('text')
        .setDescription('Adds a new text explanation.')
        .addStringOption(option =>
          option
            .setName('term')
            .setDescription("The thing you're explaining.")
            .setMinLength(2)
            .setMaxLength(100)
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('text')
            .setDescription('What the term means')
            .setMinLength(2)
            .setMaxLength(512)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('link')
        .setDescription('Adds a new link explanation.')
        .addStringOption(option =>
          option
            .setName('term')
            .setDescription("The thing you're explaining.")
            .setMinLength(2)
            .setMaxLength(100)
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('link')
            .setDescription('A link explaining the term.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('image')
        .setDescription('Adds a new image explanation.')
        .addStringOption(option =>
          option
            .setName('term')
            .setDescription("The thing you're explaining.")
            .setMinLength(2)
            .setMaxLength(100)
            .setRequired(true)
        )
        .addAttachmentOption(option =>
          option
            .setName('image')
            .setDescription('An image explaining the term.')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    let term, type, explanation, replyExplanation;

    if (interaction.options.getSubcommand() === 'text') {
      term = interaction.options.getString('term');
      type = 'text';
      explanation = interaction.options.getString('text');
    }
    if (interaction.options.getSubcommand() === 'link') {
      term = interaction.options.getString('term');
      type = 'url';
      explanation = interaction.options.getString('link');
    }
    if (interaction.options.getSubcommand() === 'image') {
      term = interaction.options.getString('term');
      type = 'image';
      explanation = interaction.options.getAttachment('image');
      replyExplanation = explanation.url;
    }

    try {
      await explanations.addExplanation(term, type, explanation, interaction.guild, interaction.member);
      await interaction.reply(`saved \`${term}:\` ${replyExplanation || explanation}`);
    } catch (err) {
      console.log(err);
      await interaction.reply({ content: err.message, ephemeral: true });
    }
  }
};
