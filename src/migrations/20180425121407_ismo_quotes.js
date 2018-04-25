exports.up = (knex, Promise) =>
  knex.schema.createTable('ismo_quotes', table => {
    table.increments('id').notNullable();
    table
      .text('quote')
      .notNullable()
      .unique();
  });

exports.down = (knex, Promise) => knex.schema.dropTable('ismo_quotes');
