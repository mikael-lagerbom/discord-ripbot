const knex = require('knex');

const { devPool } = require('./knexfile');

const Knex = knex(devPool);

module.exports = Knex;
