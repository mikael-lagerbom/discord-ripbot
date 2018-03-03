exports.up = async (knex, Promise) => {
  await knex.schema.createTable('users', table => {
    table.increments('id').notNullable();
    table.integer('discord_id').notNullable();
    table.text('username').notNullable();
    table.integer('discriminator').notNullable();
  });

  await knex.schema.createTable('channels', table => {
    table.increments('id').notNullable();
    table.integer('discord_id').notNullable();
    table.text('name').notNullable();
  });

  await knex.schema.createTable('rips', table => {
    table.increments('id').notNullable();
    table
      .text('rip')
      .notNullable()
      .unique();
    table.integer('user').unsigned();
    table.foreign('user').references('users.id');
    table.integer('channel').unsigned();
    table.foreign('channel').references('channels.id');
  });

  await knex.schema.createTable('wisdoms', table => {
    table.increments('id').notNullable();
    table
      .text('wisdom')
      .notNullable()
      .unique();
  });
};

exports.down = async (knex, Promise) => {
  await knex.schema.dropTable('users');
  await knex.schema.dropTable('channels');
  await knex.schema.dropTable('rips');
  await knex.schema.dropTable('wisdoms');
};
