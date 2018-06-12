const sendFeatureRequest = async message => {
  message.channel.send(`<https://github.com/mikhepls/discord-ripbot/pulls>`);
};

module.exports = { sendFeatureRequest };
