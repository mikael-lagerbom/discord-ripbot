const decide = message => {
  // removes the command from possible choices
  const givenOptions = message.content.replace('!decide ', '').split(',');

  // removes whitespace and filters empties and falsey values out
  const fixedOptions = givenOptions.map(word => word.trim()).filter(Boolean);

  if (message.content.indexOf('@') > -1) message.channel.send('älä oo perseestä');
  else if (fixedOptions.length > 1) {
    const randInt = Math.floor(Math.random() * Math.floor(fixedOptions.length));
    message.channel.send(fixedOptions[randInt]);
  } else {
    message.channel.send('anna mulle nyt niitä vaihtoehtoja');
  }
};

module.exports = { decide };
