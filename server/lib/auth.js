var passport = require('passport');
var passportJWT = require('passport-jwt');
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var jwtSecret = require('./localvars.js').jwtSecret;

// passport-jwt config
var cfg = {
  jwtSecret: jwtSecret,
  jwtSession: { session: false }
};

var params = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeader()
};

var strategy = new Strategy(params, function(payload, done) {
  var user = users[payload.id] || null;
  if (user) {
    return done(null, {
      id: user.id
    });
  } else {
    return done(new Error('User not found'), null);
  }
});

passport.use(strategy);


exports.initialize = function() {
  return passport.initialize();
};
exports.authenticate = function() {
  return passport.authenticate('jwt', cfg.jwtSession);
};
exports.cfg = cfg;
