var knex = require('./lib/db.js');
var st = knex.postgis;

var Activity = require('./models/Activity.js');
var User = require('./models/User.js');


exports.activitiesNearby = function(lat, long, n) {
  var lat = lat.toString();
  var long = long.toString();
  return Activity
    .query()
    // Doing JoinEagerAlgorithm instead of WhereInEagerAlgorithm
    .eagerAlgorithm(Activity.JoinEagerAlgorithm)
    .eager('[locDetailsView, sport, creator]')
    .orderBy('locDetailsView.geom', '<->', st.geomFromText('Point(' + lat + ' ' + long + ')', 4326))
    .omit(Activity, ['creatorId', 'locationId', 'sportId'])
    .omit(User, ['password', 'email', 'lastLocation', 'bioText'])
    .limit(n)
    .then(function(results) {
      return results;
    });
};

exports.getActivityById = function(id) {
  return Activity
    .query()
    .where('id', id)
    .eager('[locDetailsView, sport, creator, users]')
    .omit(Activity, ['creatorId', 'locationId', 'sportId'])
    .pick(User, ['id', 'username', 'firstName', 'lastName', 'profileUrl', 'status', 'lastActive'])
    .first()
    .then(function(activity) {
      return activity;
    });
};

exports.getProfileByUsername = function(username) {
  return User
    .query()
    .where('username', username)
    .eager('[interests]')
    .omit(User, ['password', 'email', 'lastLocation'])
    .then(function(resultArr) {
      return resultArr[0];
    });
};

exports.getUserFriendsByIdOrUsername = function(idOrUsername) {
  var queryField = isNaN(Number(idOrUsername)) ? 'username' : 'id';
  return User
    .query()
    .where(queryField, idOrUsername)
    .eager('friends')
    .omit(User, ['password', 'email', 'lastLocation', 'bioText'])
    .first()
    .then(function(user) {
      return user.friends;
    });
};




