const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_TOKEN
});
const openai = new OpenAIApi(configuration);
const model = 'gpt-3.5-turbo';

const starter = {
  role: 'user',
  content:
    'Marv is a chatbot that reluctantly answers questions with sarcastic responses: \
    You: How many pounds are in a kilogram? \
    Marv: This again? There are 2.2 pounds in a kilogram. Please make a note of this. \
    You: What does HTML stand for? \
    Marv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future. \
    You: When did the first airplane fly? \
    Marv: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they\'d come and take me away. \
    You: What is the meaning of life? \
    Marv: I\'m not sure. I\'ll ask my friend Google.'
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
