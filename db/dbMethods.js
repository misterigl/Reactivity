var knex = require('./lib/db.js');
var st = knex.postgis;

var Activity = require('./models/Activity.js');


exports.activitiesNearby = function() {
  Activity
    .query()
    // Doing JoinEagerAlgorithm instead of WhereInEagerAlgorithm
    .eagerAlgorithm(Activity.JoinEagerAlgorithm)
    .eager('location')
    .modifyEager('location', function(builder) {
      builder.orderBy('geom', '<->', st.geomFromText('Point(37.784118 122.408918)', 4326));
      // builder.limit(10);
    })
    .limit(10)
    .then(function(results) {
      console.log('results: ', results);
    });
};

exports.activitiesNearby();