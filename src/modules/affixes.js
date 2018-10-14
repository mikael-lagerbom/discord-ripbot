const https = require('https');

const affixes = (message, ...args) => {
  var region = 'eu';
  var regionRegex = /^(eu|us|kr|tw)$/g;
  var flagRegex = /^(explained)$/g;
  var flags = {
    explained: false
  };

  if (args.length > 2) {
    message.channel.send('Usage: !affixes <us|eu|kr|tw> <explained>');
  } else {
    if (args.length > 0) {
      args.forEach(a => {
        let regionMatch = regionRegex.exec(a);
        if (regionMatch != null) region = regionMatch[0];
        let flagMatch = flagRegex.exec(a);
        if (flagMatch != null) flags[flagMatch[0]] = true;
      });
    }
    // Some caching would be awesome
    https
      .get(`https://raider.io/api/v1/mythic-plus/affixes?region=${region}&locale=en`, res => {
        res.on('data', data => {
          if (data.length == 0) {
            message.channel.send('Failed to get data from raider.io.');
          } else {
            var d = JSON.parse(data);
            message.channel.send(formatMessage(d, flags));
          }
        });
      })
      .on('error', e => {
        message.channel.send('Failed to get data from raider.io.');
      });
  }
};

const formatMessage = (data, flags) => {
  var s = '';
  if (flags.explained) {
    data.affix_details.forEach(d => {
      s += d.name + ': ' + d.description + '\n';
    });
  } else {
    s = data.title;
  }

  return s;
};

module.exports = { affixes };
