const apply = (message, messageWords, generator) => {
  if (messageWords.length > 1) {
    const randInt = Math.floor(generator.random_incl() * Math.floor(10));
    if (randInt === 0) {
      message.channel.send('hyy-vä');
    } else {
      message.channel.send('tapan sut');
    }
  } else {
    message.channel.send('yritä nyt');
  }
};

module.exports = { apply };
