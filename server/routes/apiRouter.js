var apiRouter = require('express').Router();

apiRouter.route('/activities')
  .get(function(req, res) {
    res.send('Request for activities');
  });

apiRouter.route('/test')
  .get(function(req, res) {
    res.send('Hey there HR 50');
  });

// apiRouter.route('/authTest', passport.authenticate('jwt', { session: false}))
//   .get(function(req, res) {
//     res.send('Hey there authenticated user');
//   });

module.exports = apiRouter;
