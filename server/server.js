var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var morgan = require('morgan');
var colors = require('colors/safe');
var passport = require('passport');
var bodyParser = require('body-parser');


app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(passport.initialize());

app.use(express.static('client'));

require('./lib/auth.js')(passport);
require('./lib/routes.js')(app, express, passport, io);

server.listen(3000, function () {
  console.log(colors.green('\nReactivity app listening on port 3000!'));
});
