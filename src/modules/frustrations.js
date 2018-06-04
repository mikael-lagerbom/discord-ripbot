const axios = require('axios');

const getFrustration = async (message, suffix) => {
  const frustrationPage = await axios.get('https://fi.wikipedia.org/wiki/Toiminnot:Satunnainen_sivu');
  const frustrationUrl = frustrationPage.request.res.responseUrl;
  const startOfFrustration = frustrationUrl.lastIndexOf('/');
  const frustration = decodeURIComponent(frustrationUrl.slice(startOfFrustration + 1, frustrationUrl.length)).replace(
    /_/g,
    ' '
  );
  message.channel.send(`${frustration} ${suffix}`);
};

module.exports = { getFrustration };
