exports.up = async (knex, Promise) => {
  await knex.schema.createTable('explanations', table => {
    table.increments('id').notNullable();
    table.text('key').notNullable();
    table.text('explanation').notNullable();
    table.integer('user').unsigned();
    table.foreign('user').references('users.id');
    table.integer('guild').unsigned();
    table.foreign('guild').references('guilds.id');
  });
};

exports.down = async (knex, Promise) => {
  await knex.schema.dropTable('explanation');
};
