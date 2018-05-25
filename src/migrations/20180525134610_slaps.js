exports.up = (knex, Promise) =>
  knex.schema.createTable('slaps', table => {
    table.increments('id').notNullable();
    table.integer('slapper').unsigned();
    table.foreign('slapper').references('users.id');
    table.integer('slappee').unsigned();
    table.foreign('slappee').references('users.id');
    table.integer('guild').unsigned();
    table.foreign('guild').references('guilds.id');
    table.timestamp('slapped_at').defaultTo(knex.fn.now());
  });

exports.down = (knex, Promise) => knex.schema.dropTable('slaps');
