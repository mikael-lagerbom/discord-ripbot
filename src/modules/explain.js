const URL = require('url').URL;

const Discord = require('discord.js');
const voca = require('voca');

const knex = require('../knex');

const guilds = require('./guilds');
const users = require('./users');

const stringIsAValidUrl = string => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
};

const getKey = async (key, guild) => {
  return knex('explanations')
    .select('id', 'key')
    .whereRaw('LOWER(key) LIKE ?', key.toLowerCase())
    .andWhere('guild', guild);
};

const sendExplanation = explanation => {
  if (explanation.type === 'image') {
    const explanationAttachment = new Discord.Attachment(explanation.explanation);
    return { key: explanation.key, explanation: explanationAttachment };
  } else {
    return { key: explanation.key, explanation: explanation.explanation };
  }
};

const getExplanation = async (key, guild) => {
  const guildId = await guilds.getGuildId(guild);
  if (!guildId) return null;

  const [keyExists] = await getKey(key, guildId);

  if (!keyExists) {
    throw new Error(`i don't know what ${key} means`);
  } else {
    const [explanation] = await knex('explanations')
      .select('key', 'explanation', 'type')
      .where('id', keyExists.id);

    return sendExplanation(explanation);
  }
};

const getRandomExplanation = async guild => {
  const guildId = await guilds.getGuildId(guild);
  if (!guildId) return null;

  const [explanation] = await knex('explanations')
    .select('key', 'explanation', 'type')
    .where('guild', guildId)
    .orderByRaw('random()')
    .limit(1);

  return sendExplanation(explanation);
};

const addExplanation = async (key, type, explanation, guild, member) => {
  const guildId = await guilds.getGuildId(guild);
  if (!guildId) return null;

  const authorId = await users.getUserId(member);

  const [keyExists] = await getKey(key, guildId);

  if (type === 'url') {
    if (stringIsAValidUrl(explanation)) {
      explanation = `<${explanation}>`;
    } else {
      throw new Error(`${explanation} is not a valid URL`);
    }
  }
  if (type === 'image') {
    explanation = explanation.url;
  }

  if (!keyExists) {
    await knex('explanations').insert({
      key,
      explanation,
      user: authorId,
      guild: guildId,
      type
    });
  } else {
    await knex('explanations')
      .update({
        explanation,
        user: authorId,
        guild: guildId,
        type
      })
      .whereRaw('LOWER(key) LIKE ?', '%' + key.toLowerCase() + '%');
  }
};

const delExplanation = async (guild, key) => {
  const guildId = await guilds.getGuildId(guild);
  if (!guildId) return null;

  const [keyExists] = await getKey(key, guildId);

  if (keyExists) {
    const [result] = await knex('explanations')
      .del()
      .where('id', keyExists.id)
      .returning(['key', 'explanation', 'id']);
    return result;
  } else {
    throw new Error(`i don't know what ${key} means`);
  }
};

const listExplanations = async (guild, type) => {
  const guildId = await guilds.getGuildId(guild);
  if (!guildId) return null;
  type = type === 'all' ? null : type;

  const explanations = await knex('explanations')
    .pluck('key')
    .where('guild', guildId)
    .andWhere(builder => {
      if (type) {
        builder.andWhere('type', type);
      }
    });
  return `All ${type || ''} explanations: ${explanations.join(', ')}`;
};

module.exports = {
  getExplanation,
  getRandomExplanation,
  addExplanation,
  delExplanation,
  listExplanations
};
