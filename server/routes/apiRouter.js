var apiRouter = require('express').Router();
var dbMethods = require('../../db/dbMethods');

apiRouter.route('/activities')
  .get(function(req, res) {
    res.send('Request for activities');
  });

apiRouter.get('/activities/nearby/:lat/:long/:n?', function(req, res) {
  var lat = req.params.lat;
  var long = req.params.long;
  var n = req.params.n || 10;

  dbMethods.activitiesNearby(lat, long, n)
    .then(function(results) {
      res.json(results);
    })
    .catch(function(err) {
      console.error('find nearby activities error:', err);
      res.status(500).send(err);
    });
});

apiRouter.route('/test')
  .get(function(req, res) {
    res.send('Hey there HR 50');
  });

module.exports = apiRouter;