var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var morgan = require('morgan');
var colors = require('colors/safe');
var apiRouter = require('./routes/apiRouter');
require('./io.js')(io);

app.use(morgan('dev'));


app.use(express.static('client'));


app.use('/api', apiRouter);


app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

// Borrowed from anonymize: - check out shortly angular
// // Error handling
// app.use(function (err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send('Oops! Something broke on our end. Please refresh');
// });

server.listen(3000, function () {
  console.log(colors.green('\nReactivity app listening on port 3000!'));
});