
exports.up = function(knex, Promise) {
  return knex.raw(`
    CREATE RULE unfriend AS ON DELETE TO friends
      DO INSTEAD
      DELETE FROM friendships
      WHERE (
        "userId" = OLD."userId"
        AND "friendId" = OLD."friendId"
      )
      OR (
        "friendId" = OLD."userId"
        AND "userId" = OLD."friendId"
      )
  `);
};

exports.down = function(knex, Promise) {
  return knex.raw(`
    DROP RULE unfriend ON friends
  `);
};
