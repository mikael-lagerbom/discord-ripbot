const { SlashCommandBuilder } = require('discord.js');
const MersenneTwister = require('mersenne-twister');

const seed = Date.now();
const generator = new MersenneTwister(seed);

const decide = message => {
  const givenOptions = message.split(',');
  // removes whitespace and filters empties and falsey values out
  const fixedOptions = givenOptions.map(word => word.trim()).filter(Boolean);

  if (message.indexOf('@') > -1) return "don't be an ass pls";
  else if (fixedOptions.length > 1) {
    const randInt = Math.floor(generator.random_incl() * Math.floor(fixedOptions.length));
    return fixedOptions[randInt];
  } else {
    return 'give me some options pls';
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('decide')
    .setDescription('Picks one from the given options')
    .addStringOption(option =>
      option
        .setName('options')
        .setDescription('The list of options, separated by commas')
        .setMaxLength(256)
        .setRequired(true)
    ),
  async execute(interaction) {
    const decision = decide(interaction.options.getString('options'));
    await interaction.reply(`I've decided on: ${decision}`);
  }
};
