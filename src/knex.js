const knex = require('knex');

const { pool } = require('./knexfile');

const Knex = knex(pool);

module.exports = Knex;
