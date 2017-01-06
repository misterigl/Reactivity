var Activity = require('../../models/Activity');
var Location = require('../../models/Location');
var Sport = require('../../models/Sport');
var User = require('../../models/User');
var moment = require('moment');
var st = require('../../lib/db').postgis;
var faker = require('faker/locale/en_US');
var async = require('async');
var Promise = require('bluebird');

var fourDaysAgo = moment().subtract(4, 'days').format('YYYY-MM-DD');
var thirtyDaysFuture = moment().add(30, 'days').format('YYYY-MM-DD');
var sports = ['soccer', 'baseball', 'weight-training', 'basketball', 'football', 'mountain-biking', 'running'];

var createRandomActivity = function(sportIds, cb) {
  var randomLat = ((Math.random() * 0.861642) + 37.269015).toString();
  var randomLong = ((Math.random() * 1.300501) + -122.826977).toString();
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
        geom: st.geomFromText('Point(' + randomLat + ' ' + randomLong + ')', 4326)
      }]
    })
    .then(function(result) {
      cb(null, result);
    })
    .catch(function(err) {
      cb(err);
    });
};

exports.seed = function(knex, Promise) {

  // Delete all data from tables:
  return knex('users_activities').del()
  .then(function() {
    return knex('teams').del();
  })
  .then(function() {
    return Promise.all([
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

  // Create users
  .then(function() {
    return Promise.all([
      User.query().insert({username: 'nate', password: 'nate', email: 'nate@gmail.com'}),
      User.query().insert({username: 'tyler', password: 'tyler', email: 'tyler@gmail.com'}),
      User.query().insert({username: 'jarob', password: 'jarob', email: 'jarob@gmail.com'}),
      User.query().insert({username: 'michael', password: 'michael', email: 'michael@gmail.com'})
    ]);
  })

  // Create sports
  .then(function() {
    return Promise.map(sports, function(sport) {
      return Sport.query().insert({sport: sport}).returning('*').then(function(model) {
        return model.id;
      });
    });
  })

  // Insert 5000 activities from 4 days ago to 30 days from now
  .then(function(sportIds) {
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

  .catch(function(err) {
    console.error('error:', err);
  });

};