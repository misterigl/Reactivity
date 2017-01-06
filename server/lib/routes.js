var path = require('path');

module.exports = function(app, express, passport, io) {

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true })
  );

  app.post('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true })
  );



  app.get('/api/test', function (req, res) {
    res.send('Hey there HR 50')
  });

  app.get('/api/autTest', passport.authenticate('jwt', { session: false}),
    function(req, res) {
        res.send('Hey there authenticated user');
    }
);

  app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/index.html'));
  });
  io.on('connection', function(socket){
    console.log('user', socket.id, 'connected');
  });

  setInterval(() => {
    io.emit('ping', { data: (new Date())/1});
  }, 1000);

};
