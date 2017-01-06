module.exports = function(io) {

  io.on('connection', function(socket){
    console.log('user', socket.id, 'connected');
  });

  setInterval(() => {
    io.emit('ping', { data: (new Date())/1});
  }, 1000);

};
