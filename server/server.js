var express = require('express');
var app = express();
var path = require('path');
var morgan = require('morgan');
var colors = require('colors/safe');

app.use(morgan('dev'));


app.use(express.static('client'));




app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});


app.listen(3000, function () {
  console.log(colors.green('\nReactivity app listening on port 3000!'));
});