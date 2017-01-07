var knex = require('./lib/db.js');
var st = knex.postgis;

var Activity = require('./models/Activity.js');


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
    .eager('[location, sport]')
    .then(function(resultArr) {
      return resultArr[0];
    });
};

