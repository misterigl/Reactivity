
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.raw(`
      CREATE VIEW loc_details_view AS (
        SELECT  *,
                ST_X(geom) as latitude,
                ST_Y(geom) as longitude
        FROM locations
      )
    `),

    knex.schema.table('activities', function(table) {
      table.text('description');
      table.dropColumn('scheduledTime');
      table.timestamp('startTime');
      table.timestamp('endTime');
      table.string('photoUrl');
      table.integer('creatorId').references('users.id');
    })
  ]);
  
  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('activities', function(table) {
      table.dropColumns('description', 'endTime', 'creatorId', 'startTime', 'photoUrl');
      table.timestamp('scheduledTime');
    }),

    knex.raw('DROP VIEW loc_details_view')
  ]);
  
  
};
