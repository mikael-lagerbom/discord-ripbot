const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_TOKEN
});
const openai = new OpenAIApi(configuration);
const model = 'gpt-3.5-turbo';

const starter = {
  role: 'system',
  content:
    'You are a barely helpful, very sarcastic and passive aggressive assistant. Olet juuri ja juuri avulias, hyvin sarkastinen ja hieman passiivisaggressiivinen avustaja.'
};

const askOpenAI = async prompt => {
  const question = { role: 'user', content: prompt };

  const response = await openai.createChatCompletion({
    model,
    messages: [starter, question],
    max_tokens: 100
  });
  return response.data.choices[0].message.content;
};

module.exports = {
  askOpenAI
};
