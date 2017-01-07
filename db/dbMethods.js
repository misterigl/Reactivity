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
    .debug()
    .then(function(results) {
      return results;
    });
};

// exports.activitiesNearby = function() {
//   Activity
//     .query()
//     // Doing JoinEagerAlgorithm instead of WhereInEagerAlgorithm
//     .eagerAlgorithm(Activity.JoinEagerAlgorithm)
//     .eager('location')
//     .modifyEager('location', function(builder) {
//       builder.orderBy('geom', '<->', st.geomFromText('Point(37.784118 122.408918)', 4326));
//       builder.limit(10);
//     })
//     // .limit(10)
//     .then(function(results) {
//       console.log('results: ', results);
//     });
// };

