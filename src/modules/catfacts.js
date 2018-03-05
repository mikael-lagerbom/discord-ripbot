const axios = require('axios');

const getCatfact = async message => {
  const catFact = await axios.get('https://catfact.ninja/fact');
  message.channel.send(catFact.data.fact);
};

module.exports = { getCatfact };
