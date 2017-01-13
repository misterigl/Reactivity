
exports.up = function(knex, Promise) {
  return knex.raw(`
    CREATE VIEW friend_activities AS (
      SELECT  bb."userId",
              bb."activityId",
              COUNT(bb."userId") AS "numFriends"
      FROM
      (SELECT f."userId" AS "userId",
              ua."activityId" as "activityId"
      FROM friends f
      JOIN users_activities AS ua
        ON (f."friendId" = ua."userId")
      ) AS bb
      GROUP BY bb."activityId", bb."userId"
    )
  `);
};

exports.down = function(knex, Promise) {
  return knex.raw('DROP VIEW friend_activities');
};
