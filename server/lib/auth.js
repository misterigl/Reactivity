var passport = require("passport");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
// var db = require...
// var Promise = require('bluebird');
// var bcrypt = require('bcryptjs');
// bcrypt.compare = Promise.promisify(bcrypt.compare);
var jwtSecret = require('./localvars.js').jwtSecret;


//using an array if users before hooking up DB
var users = [{
    id: 1,
    name: "John",
    email: "john@mail.com",
    password: "john123"
}, {
    id: 2,
    name: "Sarah",
    email: "sarah@mail.com",
    password: "sarah123"
}];

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

//tutorial at https://blog.jscrambler.com/implementing-jwt-using-passport/
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
