const roll = (message, messageWords, generator) => {
  if (messageWords.length === 1) {
    const randInt = Math.floor(generator.random_incl() * Math.floor(100));
    message.channel.send(randInt);
  } else if (messageWords.length === 2) {
    const limit = parseInt(messageWords[1]);
    if (!isNaN(limit)) {
      const randInt = Math.floor(generator.random_incl() * Math.floor(limit));
      message.channel.send(randInt);
    } else {
      message.channel.send('try pls');
    }
  } else {
    message.channel.send('try pls');
  }
};

module.exports = { roll };
