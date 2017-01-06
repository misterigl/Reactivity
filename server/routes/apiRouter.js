var apiRouter = require('express').Router();

apiRouter.route('/activities')
  .get(function(req, res) {
    res.send('Request for activities');
  });

module.exports = apiRouter;