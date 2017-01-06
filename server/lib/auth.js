var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
// var db = require...
// var Promise = require('bluebird');
// var bcrypt = require('bcryptjs');
// bcrypt.compare = Promise.promisify(bcrypt.compare);
var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: 'secret'
}

var testuser = {
  id: 1,
  name: 'tester',
  password: 'test123',
  email: 'test@test.com'
};
//tutorial at https://blog.jscrambler.com/implementing-jwt-using-passport/
module.exports = function(passport) {
  // passport.serializeUser(function(user, done) {
  //   done(null, user.id);
  // });
  //
  // passport.deserializeUser(function(id, done) {
  //   db.User.find({where: {id: id}}).then(function(user) {
  //     done(null, user);
  //   }).error(function(err) {
  //     done(err, null);
  //   });
  // });

// dummy user + password checking, always allowing access
  passport.use(new JwtStrategy(opts, function(payload, done) {
    done(null, testuser);
  }));
};
