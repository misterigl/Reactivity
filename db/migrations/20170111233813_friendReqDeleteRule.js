
exports.up = function(knex, Promise) {
  return knex.raw(`
    CREATE RULE friend_req_delete AS ON DELETE TO friend_requests
      DO INSTEAD
      DELETE FROM friendships
      WHERE "userId" = OLD."userId" AND "friendId" = OLD."requestedUserId"
  `);
};

exports.down = function(knex, Promise) {
  return knex.raw('DROP RULE friend_req_delete ON friend_requests');
};
