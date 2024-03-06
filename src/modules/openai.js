const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_TOKEN
});
const openai = new OpenAIApi(configuration);
const model = 'gpt-4';

const starter = {
  role: 'system',
  content: 'Keep your answers concise and to the point.'
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
