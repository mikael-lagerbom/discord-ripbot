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

const answer = (message, messageWords, generator) => {
  if (messageWords.length === 1) {
    message.channel.send('Ole hyvä, ja esitä kysymys.');
  } else if (messageWords.length >= 2) {
    const randInt = Math.floor(generator.random_incl() * Math.floor(eightBallAnswers.length));
    message.channel.send(eightBallAnswers[randInt]);
  }
};

module.exports = { answer };
