var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var morgan = require('morgan');
var colors = require('colors/safe');
// var passport = require('passport');
var bodyParser = require('body-parser');

var auth = require('./lib/auth.js');
var apiRouter = require('./routes/apiRouter');
var authRouter = require('./routes/authRouter');
require('./io.js')(io);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(auth.initialize());
app.use('/auth', authRouter);
app.use('/api', auth.authenticate(), apiRouter);

app.use(express.static('client'));

// Borrowed from anonymize: - check out shortly angular
// // Error handling
// app.use(function (err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send('Oops! Something broke on our end. Please refresh');
// });


server.listen(3000, function () {
  console.log(colors.green('\nReactivity app listening on port 3000!'));
});
