const roll = (message, messageWords) => {
  const limit = parseInt(messageWords[1]);
  if (!isNaN(limit)) {
    const randInt = Math.floor(Math.random() * Math.floor(limit));
    message.channel.send(randInt);
  } else {
    message.channel.send('yritä nyt');
  }
};

module.exports = { roll };
