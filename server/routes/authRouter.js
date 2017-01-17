var authRouter = require('express').Router();
var jwt = require('jwt-simple');
var auth = require('../lib/auth');
var User = require('../../db/models/User');
var moment = require('moment');
var Promise = require('bluebird');
var bcrypt = require('bcryptjs');
bcrypt.compare = Promise.promisify(bcrypt.compare);
var dbMethods = require('../../db/dbMethods.js');

authRouter.get('/test', function(req, res) {
  User.query()
    .then(function(users) {
      res.json(users);
    })
    .catch(function(err) {
      console.error(err);
      res.json(err);
    });
});

authRouter.post('/login', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  if (!email || !password) {
    res.status(400).send('Incomplete email/password');
    return;
  }
  User.query().where('email', email)
    .then(function(user) {
      var user = user[0];
      if (!user) {
        throw 'Error: user does not exist';
      } else {
        return Promise.all([
          bcrypt.compare(password, user.password),
          user
        ]);
      }
    })
    .spread(function(authenticated, user) {
      if (!authenticated) {
        throw 'Invalid password';
      } else {
        var payload = { id: user.id, exp: moment().add(30, 'days').unix() };
        var token = jwt.encode(payload, auth.cfg.jwtSecret);
        res.json({ token: token, userId: user.id, username: user.username });
      }
    })
    .catch(function(authError) {
      res.status(401).send(authError);
    })
    .error(function(err) {
      console.error('Auth server error: ', err);
      res.status(500).send('Server error');
    });
});

authRouter.post('/signup', dbMethods.signupUser);

module.exports = authRouter;
