const axios = require('axios');

const assault = async message => {
  const url = 'https://xctd.fi/assault';

  const response = await axios.get(url);
  const assaultText = response.data.next;

  message.channel.send(assaultText || 'Seuraavan assaultin haku epäonnistui, syytä Execiä');
};

module.exports = { assault };
