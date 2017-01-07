var authRouter = require('express').Router();
var jwt = require("jwt-simple");
var jwtSecret = require('../lib/localvars.js').jwtSecret;

// passport-jwt config
var cfg = {
    jwtSecret: jwtSecret,
    jwtSession: {
        session: false
      }
};

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

authRouter.post("/login", function(req, res) {
  console.log('req.body', req.body);
  if (req.body.email && req.body.password) {
    var email = req.body.email;
    var password = req.body.password;
    var user = users.find(function(u) {
        return u.email === email && u.password === password;
    });
    if (user) {
      console.log('user found', user);
      var payload = {
          id: user.id
      };
      var token = jwt.encode(payload, cfg.jwtSecret);
      res.json({
          token: token
      });
    } else {
      console.log('user not found', user);
      res.sendStatus(401);
    }
  } else {
    console.log('body not found', body);
    res.sendStatus(401);
  }
});

module.exports = authRouter;
