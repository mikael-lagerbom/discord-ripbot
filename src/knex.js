const knex = require('knex');

const knexfile = require('./knexfile');

const Knex = knex(knexfile);

module.exports = Knex;
