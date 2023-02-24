const { SlashCommandBuilder } = require('discord.js');
const MersenneTwister = require('mersenne-twister');

const eightBallAnswers = [
  'Se on varmaa.',
  'Niin on päätetty.',
  'Se on epäilemättä niin.',
  'Kyllä, ehdottomasti.',
  'Voit luottaa siihen.',
  'Näin minä näkisin asian.',
  'Suurella todennäköisyydellä.',
  'Merkit osoittavat positiiviseen lopputulokseen.',
  'Vastaus epäselvä, yritä uudelleen.',
  'Kysy uudelleen myöhemmin.',
  'Parempi etten vastaa tähän tällä hetkellä.',
  'En voi ennustaa tätä tulevaisuutta.',
  'Keskity, ja yritä uudelleen.',
  'En luottaisi siihen.',
  'Vastaukseni on _ei_.',
  'Lähteeni sanovat _ei_.',
  'Lopputulema ei näytä hyvältä.',
  'Erittäin epätodennäköisesti.',
  'Ei missään nimessä.',
  'Turha kuvitellakaan.',
  'Ulostaako karhu metsään?',
  'Onko Jorixilla tähän sopiva kuva?'
];

const seed = Date.now();
const generator = new MersenneTwister(seed);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eightball')
    .setDescription('Answers the question with suitable accuracy, in Finnish.')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('The question you want to ask from Eightball, in Finnish.')
        .setMaxLength(256)
        .setRequired(true)
    ),
  async execute(interaction) {
    const answer = eightBallAnswers[Math.floor(generator.random_incl() * Math.floor(eightBallAnswers.length))];
    await interaction.reply(answer);
  }
};
