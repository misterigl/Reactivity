var Activity = require('../../models/Activity');
var Location = require('../../models/Location');
var Sport = require('../../models/Sport');
var User = require('../../models/User');
var moment = require('moment');
var st = require('../../lib/db').postgis;
var faker = require('faker/locale/en_US');
var async = require('async');
var Promise = require('bluebird');
var _ = require('underscore');

var fourDaysAgo = moment().subtract(4, 'days').format('YYYY-MM-DD');
var thirtyDaysFuture = moment().add(30, 'days').format('YYYY-MM-DD');
var sports = ['soccer', 'baseball', 'weight-training', 'basketball', 'football', 'mountain-biking', 'running'];

var randomSFLat = function() {
  return ((Math.random() * 0.861642) + 37.269015).toString();
};
var randomSFLong = function() {
  return ((Math.random() * 1.300501) + -122.826977).toString();
};

var createRandomActivity = function(sportIds, cb) {
  // var randomLat = ((Math.random() * 0.861642) + 37.269015).toString();
  // var randomLong = ((Math.random() * 1.300501) + -122.826977).toString();
  var randomSportId = sportIds[ Math.floor(Math.random() * sportIds.length) ];
  Activity.query()
    .insertWithRelated({
      title: faker.company.catchPhrase(),
      sportId: randomSportId,
      scheduledTime: faker.date.between(fourDaysAgo, thirtyDaysFuture),
      location: [{
        name: faker.company.companyName(),
        streetAddress1: faker.fake('{{address.streetAddress}} {{address.streetName}}'),
        city: faker.address.city(),
        state: 'California',
        postalCode: faker.address.zipCode('#####'),
        geom: st.geomFromText('Point(' + randomSFLat() + ' ' + randomSFLong() + ')', 4326)
      }]
    })
    .then(function(result) {
      cb(null, result);
    })
    .catch(function(err) {
      cb(err);
    });
};

var createRandomUser = function(sportIds, cb) {
  var fakeUser = faker.internet.userName() + faker.random.number(999);
  var randomSportIds = _.sample(sportIds, Math.floor(Math.random() * sportIds.length));
  User.query()
    .insertWithRelated({
      username: fakeUser,
      password: fakeUser,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: fakeUser + '@gmail.com',
      lastLocation: st.geomFromText('Point(' + randomSFLat() + ' ' + randomSFLong() + ')', 4326),
      lastActive: faker.date.recent(),
      bioText: faker.hacker.phrase(),
      profileUrl: faker.image.avatar(),
      locations: [
        {
          city: faker.address.city(),
          state: 'California',
          postalCode: faker.address.zipCode('#####'),
          geom: st.geomFromText('Point(' + randomSFLat() + ' ' + randomSFLong() + ')', 4326),
          locationName: 'home'
        }, 
        {
          city: faker.address.city(),
          state: 'California',
          postalCode: faker.address.zipCode('#####'),
          geom: st.geomFromText('Point(' + randomSFLat() + ' ' + randomSFLong() + ')', 4326),
          locationName: 'work'
        }
      ],
      interests: randomSportIds.map(function(id) { return { '#dbRef': id }; })
    })
    .then(function(result) {
      cb(null, result);
    })
    .catch(function(err) {
      cb(err);
    });
};

var friendRandomly = function(userId, userIdArr) {
  // Make 75 friend requests (randomly occuring bi-directional requests mean users become friends!)
  var indexOfSelf = userId - userIdArr[0];
  var possibleFriendIds = userIdArr.slice(0, indexOfSelf).concat(userIdArr.slice(indexOfSelf + 1));
  var listOfFriendsToMake = _.sample(possibleFriendIds, 75);
  return User
    .query()
    .where('id', userId)
    .first()
    .then(function(user) {
      return user.$relatedQuery('friendsUniDir').relate(listOfFriendsToMake);
    });
};

exports.seed = function(knex, Promise) {

  // Delete all data from tables:
  return knex('users_activities').del()
  .then(function() {
    console.log('Clearing old data from tables...');
    return knex('teams').del();
  })
  .then(function() {
    return Promise.all([
      knex('friendships').del(),
      knex('activities').del(),
      knex('interests').del(),
      knex('users_locations').del()
    ]);
  })
  .then(function() {
    return Promise.all([
      knex('sports').del(),
      knex('locations').del(),
      knex('users').del()
    ]);
  })

  // Create users without connections/activities pre-linked
  .then(function() {
    return Promise.all([
      User.query().insert({username: 'nate', password: 'nate', email: 'nate@gmail.com', firstName: 'Nate', lastName: 'Graf', bioText: '\"This is ten percent luck, twenty percent skill, fifteen percent concentrated power of will. Five percent pleasure, fifty percent pain, and one hundred percent reason to remember the name.\" 😎'}),
      User.query().insert({username: 'tyler', password: 'tyler', email: 'tyler@gmail.com', firstName: 'Tyler', lastName: 'Gassman'}),
      User.query().insert({username: 'jarob', password: 'jarob', email: 'jarob@gmail.com', firstName: 'Jarob', lastName: 'Gilliam'}),
      User.query().insert({username: 'michael', password: 'michael', email: 'michael@gmail.com', firstName: 'Michael', lastName: 'Ilg'})
    ]);
  })

  // Create sports
  .then(function() {
    console.log('Generating sports...');
    return Promise.map(sports, function(sport) {
      return Sport.query().insert({sport: sport}).returning('*').then(function(model) {
        return model.id;
      });
    });
  })

  // Insert 200 users
  .then(function(sportIds) {
    console.log('Inserting 200 users...');
    return new Promise(function(resolve, reject) {
      async.times(200, function(n, next) {
        createRandomUser(sportIds, function(err, result) {
          next(err, result);
        });
      }, function(err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(sportIds);
        }
      });
    });
  })

  // Insert 5000 activities from 4 days ago to 30 days from now
  .then(function(sportIds) {
    console.log('Generating 5000 activities...');
    return new Promise(function(resolve, reject) {
      async.times(5000, function(n, next) {
        createRandomActivity(sportIds, function(err, result) {
          next(err, result);
        });
      }, function(err, results) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  })

  // Make each user send 75 random friend requests (mutual requests make friends)
  .then(function() {
    console.log('Making friend connections between users...');
    return Promise.all([
      User.query().min('id').then(function(result) { return result[0].min; }),
      User.query().max('id').then(function(result) { return result[0].max; })
    ]);
  })
  .spread(function(minId, maxId) {
    var userIds = [];
    for (var i = minId; i <= maxId; i++) {
      userIds.push(i);
    }
    return Promise.map(userIds, function(id) {
      return friendRandomly(id, userIds);
    });
  })

  .catch(function(err) {
    console.error('error:', err);
  });

};