const roll = (message, messageWords) => {
  if (messageWords.length === 1) {
    const randInt = Math.floor(Math.random() * Math.floor(100));
    message.channel.send(randInt);
  } else if (messageWords.length === 2) {
    const limit = parseInt(messageWords[1]);
    if (!isNaN(limit)) {
      const randInt = Math.floor(Math.random() * Math.floor(limit));
      message.channel.send(randInt);
    } else {
      message.channel.send('yritä nyt');
    }
  } else {
    message.channel.send('yritä nyt');
  }
};

module.exports = { roll };
