const knex = require('knex');

const { devPool, prodPool } = require('./knexfile');

const Knex = knex(process.env.NODE_ENV === 'production' ? prodPool : devPool);

module.exports = Knex;
