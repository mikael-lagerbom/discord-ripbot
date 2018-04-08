const decide = (message, messageWords) => {
  // remove decide from the beginning
  if (message.content.indexOf('@') > -1) message.channel.send('älä oo perseestä');
  else if (messageWords.length > 2) {
    const choices = messageWords.splice(1, messageWords.length - 1);
    const randInt = Math.floor(Math.random() * Math.floor(choices.length));
    message.channel.send(choices[randInt]);
  } else {
    message.channel.send('anna mulle nyt niitä vaihtoehtoja');
  }
};

module.exports = { decide };
