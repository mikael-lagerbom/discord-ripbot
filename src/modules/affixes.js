const axios = require('axios');

const affixes = async (message, ...args) => {
  const regionRegex = /^(eu|us|kr|tw)$/g;
  const flagRegex = /^(explained)$/g;

  const usage = 'Usage: !affixes <us|eu|kr|tw> <explained>';
  const errorMessage = 'Failed to get data from raider.io.';

  const options = {
    region: 'eu',
    explained: false
  };

  if (args.length > 2) {
    message.channel.send(usage);
  } else {
    if (args.length > 0) {
      //check for given options
      args.forEach(arg => {
        const regionMatch = regionRegex.exec(arg);
        if (regionMatch) options.region = regionMatch[0];
        if (flagRegex.exec(arg)) options.explained = true;
      });
    }
    // Some caching would be awesome
    try {
      const returnedData = await axios.get(resolveUrl(options.region));
      if (returnedData.length == 0) {
        message.channel.send(errorMessage);
      } else {
        message.channel.send(formatMessage(returnedData.data, options.explained));
      }
    } catch (error) {
      message.channel.send(errorMessage);
    }
  }
};

const resolveUrl = region => `https://raider.io/api/v1/mythic-plus/affixes?region=${region}&locale=en`;

const formatMessage = (data, explained) => {
  if (explained) {
    return data.affix_details.reduce((messageString, affix) => {
      return (messageString += affix.name + ': ' + affix.description + '\n');
    }, '');
  } else {
    return data.title;
  }
};

module.exports = { affixes };
