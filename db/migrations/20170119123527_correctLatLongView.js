
exports.up = function(knex, Promise) {
  return knex.raw('DROP VIEW loc_details_view')
  .then(function() {
    return knex.raw(`
      CREATE VIEW loc_details_view AS (
        SELECT  *,
                ST_X(geom) as longitude,
                ST_Y(geom) as latitude
        FROM locations
      )
    `);
  });
};

exports.down = function(knex, Promise) {
  return knex.raw('DROP VIEW loc_details_view')
  .then(function() {
    return knex.raw(`
      CREATE VIEW loc_details_view AS (
        SELECT  *,
                ST_X(geom) as latitude,
                ST_Y(geom) as longitude
        FROM locations
      )
    `);
  });
};
