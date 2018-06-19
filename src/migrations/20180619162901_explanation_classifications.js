exports.up = async (knex, Promise) =>
  knex.schema.table('explanations', table => {
    table
      .enu('type', ['image', 'url', 'text'])
      .notNullable()
      .defaultTo('text');
  });

exports.down = async (knex, Promise) =>
  knex.schema.table('explanation', table => {
    table.dropColumn('type');
  });
