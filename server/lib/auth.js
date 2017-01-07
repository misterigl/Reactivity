var passport = require("passport");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
// var db = require...
// var Promise = require('bluebird');
// var bcrypt = require('bcryptjs');
// bcrypt.compare = Promise.promisify(bcrypt.compare);
var jwtSecret = require('./localvars.js').jwtSecret;

// passport-jwt config
var cfg = {
    jwtSecret: jwtSecret,
    jwtSession: {
        session: false
      }
};

var params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function() {
    var strategy = new Strategy(params, function(payload, done) {
        var user = users[payload.id] || null;
        if (user) {
            return done(null, {
                id: user.id
            });
        } else {
            return done(new Error("User not found"), null);
        }
    });
    passport.use(strategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};
