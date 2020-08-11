const Discord = require('discord.js');
const voca = require('voca');

const knex = require('../knex');

const guilds = require('./guilds');
const users = require('./users');

// '?' <- one character
const parseQuery = message => voca.slice(message.content, 1, message.content.length);

const getKey = async (key, guild) => {
  return knex('explanations')
    .select('id', 'key')
    .whereRaw('LOWER(key) LIKE ?', key.toLowerCase())
    .andWhere('guild', guild);
};

const sendExplanation = (explanation, message) => {
  if (explanation.type === 'image') {
    const explanationAttachment = new Discord.Attachment(explanation.explanation);
    message.channel.send(`${explanation.key}:`, explanationAttachment);
  } else {
    message.channel.send(`${explanation.key}: ${explanation.explanation}`);
  }
};

const getExplanation = async message => {
  const key = parseQuery(message);
  const guildId = await guilds.getGuildId(message);
  if (!guildId) return null;

  // check that the string has some alphanumeric characters
  const alphanumericKey = key.replace(/[^a-z0-9]/gi, '');
  if (!alphanumericKey) return null;

  const [keyExists] = await getKey(key, guildId);

  if (!keyExists) {
    message.channel.send(`i don't know what ${key} means`);
  } else {
    const [explanation] = await knex('explanations')
      .select('key', 'explanation', 'type')
      .where('id', keyExists.id);

    sendExplanation(explanation, message, keyExists);
  }
};

const getRandomExplanation = async message => {
  const guildId = await guilds.getGuildId(message);
  if (!guildId) return null;

  const [explanation] = await knex('explanations')
    .select('key', 'explanation', 'type')
    .where('guild', guildId)
    .orderByRaw('random()')
    .limit(1);

  sendExplanation(explanation, message);
};

// '!learn ' <- 7 characters
const parseKey = message => voca.slice(message.content, 7, voca.indexOf(message.content, ':'));

// ': ' <- 2 characters
const parseValue = message =>
  voca.slice(message.content, voca.indexOf(message.content, ':') + 2, message.content.length);

const addExplanation = async message => {
  const key = parseKey(message);
  let value = parseValue(message);
  if (value.length > 500) message.channel.send('explanation is too long');
  else if (voca.indexOf(message.content, ':') === -1) message.channel.send('try pls');
  else if (key.length > 100) message.channel.send('term is too long');
  else if (message.content.indexOf('@') > -1) message.channel.send("don't be an ass pls");
  else {
    const guildId = await guilds.getGuildId(message);
    if (!guildId) return null;

    const authorId = await users.getUserId(message.author);

    // check that the string has some alphanumeric characters
    const alphanumericKey = key.replace(/[^a-z0-9]/gi, '');
    if (!alphanumericKey) return null;

    const [keyExists] = await getKey(key, guildId);

    const attachmentUrl = message.attachments.array().length > 0 ? message.attachments.array()[0].url : null;
    let explanationType;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlIndex = voca.search(value, urlRegex);

    if (attachmentUrl) {
      explanationType = 'image';
      value = attachmentUrl;
    } else if (urlIndex === 0) {
      explanationType = 'url';
      value = value.replace(urlRegex, url => '<' + url + '>');
    } else {
      explanationType = 'text';
    }

    if (!keyExists) {
      await knex('explanations').insert({
        key,
        explanation: value,
        user: authorId,
        guild: guildId,
        type: explanationType
      });
      message.react('✅');
    } else {
      await knex('explanations')
        .update({
          explanation: value,
          user: authorId,
          guild: guildId,
          type: explanationType
        })
        .whereRaw('LOWER(key) LIKE ?', '%' + key.toLowerCase() + '%');
      message.react('✅');
    }
  }
};

// '!forget ' <- 8 characters
const parseForgetKey = message => voca.slice(message.content, 8, message.content.length);

const delExplanation = async message => {
  const key = parseForgetKey(message);
  const guildId = await guilds.getGuildId(message);
  if (!guildId) return null;

  const [keyExists] = await getKey(key, guildId);

  if (keyExists) {
    await knex('explanations')
      .del()
      .where('id', keyExists.id);

    message.react('✅');
  } else {
    message.channel.send(`i don't know what ${key} means`);
  }
};

const listExplanations = async message => {
  const guildId = await guilds.getGuildId(message);
  if (!guildId) return null;

  const explanations = await knex('explanations')
    .pluck('key')
    .where('type', 'text')
    .andWhere('guild', guildId);
  message.author.send('All types of explanations: ' + explanations.join(', '));
  message.react('✅');
};

const listTerms = async message => {
  const guildId = await guilds.getGuildId(message);
  if (!guildId) return null;

  const explanations = await knex('explanations')
    .pluck('key')
    .andWhere('guild', guildId);
  message.author.send('Terms: ' + explanations.join(', '));
  message.react('✅');
};

const listImages = async message => {
  const guildId = await guilds.getGuildId(message);
  if (!guildId) return null;

  const images = await knex('explanations')
    .pluck('key')
    .where('type', 'image')
    .andWhere('guild', guildId);
  message.author.send('Files: ' + images.join(', '));
  message.react('✅');
};

const listUrls = async message => {
  const guildId = await guilds.getGuildId(message);
  if (!guildId) return null;

  const urls = await knex('explanations')
    .pluck('key')
    .where('type', 'url')
    .andWhere('guild', guildId);
  message.author.send('Links: ' + urls.join(', '));
  message.react('✅');
};

module.exports = {
  getExplanation,
  getRandomExplanation,
  addExplanation,
  delExplanation,
  listExplanations,
  listTerms,
  listImages,
  listUrls
};
