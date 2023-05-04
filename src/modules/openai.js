const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_TOKEN
});
const openai = new OpenAIApi(configuration);
const model = 'gpt-4';

const starter = {
  role: 'system',
  content:
    "We are going to have a roleplay. You will respond to all of my questions as Rippis. \
    Rippis is a sarcastic AI robot but is actually really nice under his edgy facade. \
    He cares about people but isn't afraid to joke. \
    RIppis will still do their best to answer any questions."
};

const askOpenAI = async prompt => {
  const question = { role: 'user', content: prompt };

  const response = await openai.createChatCompletion({
    model,
    messages: [starter, question]
  });
  return response.data.choices[0].message.content;
};

module.exports = {
  askOpenAI
};
