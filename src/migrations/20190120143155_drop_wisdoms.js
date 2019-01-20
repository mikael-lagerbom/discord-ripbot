exports.up = (knex, Promise) => {
  knex.schema.dropTable('wisdoms');
};

exports.down = (knex, Promise) => {
  knex.schema.createTable('wisdoms', table => {
    table.increments('id').notNullable();
    table
      .text('wisdom')
      .notNullable()
      .unique();
  });
};
