var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var morgan = require('morgan');
var colors = require('colors/safe');

app.use(morgan('dev'));


app.use(express.static('client'));

app.get('/api/test', function (req, res) {
  res.send('Hey there HR 50')
})

app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});
io.on('connection', function(socket){
  console.log('user', socket.id, 'connected');
});

setInterval(() => {
  io.emit('ping', { data: (new Date())/1});
}, 1000);

server.listen(3000, function () {
  console.log(colors.green('\nReactivity app listening on port 3000!'));
});
