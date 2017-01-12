
exports.up = function(knex, Promise) {
  return knex.raw(`
    CREATE VIEW friend_requests AS (
      SELECT a."userId",
             a."friendId" AS "requestedUserId"
      FROM friendships a
      LEFT JOIN friendships b
        ON (a."userId" = b."friendId" AND a."friendId" = b."userId")
      WHERE b."userId" IS NULL AND b."friendId" IS NULL
    )
  `);
};

exports.down = function(knex, Promise) {
  return knex.raw('DROP VIEW friend_requests');
};
