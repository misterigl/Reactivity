var User = require('./db/models/User.js');

User
  .query()
  .insert({username: 'testUser', password: 'testPW', email: 'testEmail'})
  .then(function(user) {
    console.log(user);
  });