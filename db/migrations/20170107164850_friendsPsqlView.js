
exports.up = function(knex, Promise) {
  return knex.raw(`
    CREATE VIEW friends AS (
      SELECT a."userId",
             a."friendId"
      FROM friendships a
      JOIN friendships b
        ON (a."userId" = b."friendId" AND a."friendId" = b."userId")
    )
  `);
};

exports.down = function(knex, Promise) {
  return knex.raw('DROP VIEW friends');
};
