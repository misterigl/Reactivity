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
    .eager('[location, sport]')
    .orderBy('location.geom', '<->', st.geomFromText('Point(' + lat + ' ' + long + ')', 4326))
    .limit(n)
    .then(function(results) {
      return results;
    });
};

exports.getActivityById = function(id) {
  return Activity
    .query()
    .where('id', id)
    .eager('[locDetailsView, sport, creator]')
    .then(function(resultArr) {
      return resultArr[0];
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
    .first()
    .then(function(user) {
      return user.friends;
    });
};




