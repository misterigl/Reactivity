
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table) {
      table.string('firstName');
      table.string('lastName');
      table.string('bioText', 1000);
      table.string('profileUrl');
    }),

    knex.schema.createTable('friendships', function(table) {
      table.increments('id').primary();
      table.integer('userId').references('users.id').notNullable();
      table.integer('friendId').references('users.id').notNullable();
      table.unique(['userId', 'friendId']);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('friendships'),
    knex.schema.table('users', function(table) {
      table.dropColumns('firstName', 'lastName', 'bioText', 'profileUrl');
    })
  ]);
};
