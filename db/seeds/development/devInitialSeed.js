var Activity = require('../../models/Activity');
var Location = require('../../models/Location');
var Sport = require('../../models/Sport');
var User = require('../../models/User');
var moment = require('moment');
var st = require('../../lib/db').postgis;

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

  .then(function() {
    return Promise.all([
      Activity.query()
      .insertWithRelated({
        title: 'Turkey Bowl',
        scheduledTime: moment().year(2017).month(11).date(23).hour(13),
        location: [{
          name: 'CV High School',
          streetAddress1: '6746 Carlisle Pike',
          city: 'Mechanicsburg',
          state: 'Pennsylvania',
          postalCode: '17050',
          geom: st.geomFromText('Point(40.239949 -77.061538)', 4326)
        }],
        sport: [{
          sport: 'football'
        }]
      }),

      Activity.query()
        .insertWithRelated({
          title: 'Graduation Lifting',
          scheduledTime: moment().year(2017).month(1).date(3).hour(15),
          location: [{
            name: 'LA Fitness',
            streetAddress1: '3321 Trindle Road',
            city: 'Camp Hill',
            state: 'Pennsylvania',
            postalCode: '17011',
            geom: st.geomFromText('Point(40.234915 -76.936583)', 4326)
          }],
          sport: [{
            sport: 'weight-training'
          }]
        }),

        Activity.query()
        .insertWithRelated({
          title: 'Tennis',
          scheduledTime: moment().year(2017).month(1).date(3).hour(15),
          location: [{
            name: 'Bay Club SF Tennis',
            streetAddress1: '645 5th St',
            city: 'San Francisco',
            state: 'California',
            postalCode: '94107',
            geom: st.geomFromText('Point(37.779066 -122.398362)', 4326)
          }],
          sport: [{
            sport: 'tennis'
          }]
        })





    ]);
  });




};


  // // Create Users
  // .then(function() {
  //   return User.query().insert({username: 'nate', password: 'nate', email: 'nate@gmail.com'});
  // })
  // .then(function() {
  //   return User.query().insert({username: 'tyler', password: 'tyler', email: 'tyler@gmail.com'});
  // })
  // .then(function() {
  //   return User.query().insert({username: 'jarob', password: 'jarob', email: 'jarob@gmail.com'});
  // })
  // .then(function() {
  //   return User.query().insert({username: 'michael', password: 'michael', email: 'michael@gmail.com'});
  // })
