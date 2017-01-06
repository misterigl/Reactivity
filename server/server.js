var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var morgan = require('morgan');
var colors = require('colors/safe');
// var passport = require('passport');
var bodyParser = require('body-parser');

var auth = require("./lib/auth.js")();
var apiRouter = require('./routes/apiRouter');
require('./io.js')(io);

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(auth.initialize());

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

app.get("/authTest", auth.authenticate(), function(req, res) {
    res.send('Hey there authenticated user');
});

app.post("/token", function(req, res) {
    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
        var user = users.find(function(u) {
            return u.email === email && u.password === password;
        });
        if (user) {
            var payload = {
                id: user.id
            };
            var token = jwt.encode(payload, cfg.jwtSecret);
            res.json({
                token: token
            });
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});

server.listen(3000, function () {
  console.log(colors.green('\nReactivity app listening on port 3000!'));
});
