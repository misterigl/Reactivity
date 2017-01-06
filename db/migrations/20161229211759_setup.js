
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('username').unique().notNullable();
      table.string('password').notNullable();
      table.string('email').unique().notNullable();
      table.specificType('lastLocation', 'geometry(point, 4326)');
      table.timestamp('lastActive');
    }),

    knex.schema.createTable('locations', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('streetAddress1');
      table.string('streetAddress2');
      table.string('city');
      table.string('state');
      table.string('postalCode');
      table.specificType('geom', 'geometry(point, 4326)');
    }),

    knex.schema.createTable('sports', function(table) {
      table.increments('id').primary();
      table.string('sport');
    })
  ])
  .then(function() {
    return Promise.all([
      knex.schema.createTable('users_locations', function(table) {
        table.increments('id').primary();
        table.integer('userId').references('users.id');
        table.integer('locationId').references('locations.id');
        table.string('locationName');
        table.unique(['userId', 'locationId']);
        table.unique(['userId', 'locationName']);
      }),

      knex.schema.createTable('interests', function(table) {
        table.increments('id').primary();
        table.integer('userId').references('users.id');
        table.integer('sportId').references('sports.id');
      }),

      knex.schema.createTable('activities', function(table) {
        table.increments('id').primary();
        table.string('title');
        table.integer('sportId').references('sports.id');
        table.integer('minParticipants').unsigned();
        table.integer('maxParticipants').unsigned();
        table.string('status');
        table.timestamp('scheduledTime');
        table.integer('locationId').references('locations.id');
      })
    ]);
  })
  .then(function() {
    return knex.schema.createTable('teams', function(table) {
      table.increments('id').primary();
      table.integer('activityId').references('activities.id');
      table.integer('teamIndex').unsigned();
      table.integer('teamScore');
    });
  })
  .then(function() {
    return knex.schema.createTable('users_activities', function(table) {
      table.increments('id').primary();
      table.integer('userId').references('users.id');
      table.integer('activityId').references('activities.id');
      table.string('status').notNullable();
      table.integer('teamId').references('teams.id');
    });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users_activities')
  .dropTable('teams')
  .then(function() {
    return Promise.all([
      knex.schema.dropTable('activities'),
      knex.schema.dropTable('interests'),
      knex.schema.dropTable('users_locations')
    ]);
  })
  .then(function() {
    return Promise.all([
      knex.schema.dropTable('sports'),
      knex.schema.dropTable('locations'),
      knex.schema.dropTable('users'),
    ]);
  });
};