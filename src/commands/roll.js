const { SlashCommandBuilder } = require('discord.js');
const MersenneTwister = require('mersenne-twister');

const seed = Date.now();
const generator = new MersenneTwister(seed);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rolls a number between 0 and 100, or 0 and max if given')
    .addIntegerOption(option =>
      option
        .setName('max')
        .setDescription('The max number for the roll')
        .setMaxValue(9999)
    ),
  async execute(interaction) {
    const max = interaction.options.getInteger('max') ?? 100;
    const roll = Math.floor(generator.random_incl() * Math.floor(max || 100));
    await interaction.reply(`You rolled ${roll(max)}`);
  }
};
