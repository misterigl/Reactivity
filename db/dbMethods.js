var knex = require('./lib/db.js');
var st = knex.postgis;
var moment = require('moment');

var Activity = require('./models/Activity.js');
var User = require('./models/User.js');
var Sport = require('./models/Sport.js');


exports.activitiesNearby = function(lat, long, n) {
  var lat = lat.toString();
  var long = long.toString();
  return Activity
    .query()
    // Doing JoinEagerAlgorithm instead of WhereInEagerAlgorithm
    .eagerAlgorithm(Activity.JoinEagerAlgorithm)
    .eager('[locDetailsView, sport, creator]')
    .orderBy('locDetailsView.geom', '<->', st.geomFromText('Point(' + lat + ' ' + long + ')', 4326))
    .omit(Activity, ['creatorId', 'locationId', 'sportId'])
    .omit(User, ['password', 'email', 'lastLocation', 'bioText'])
    .limit(n)
    .debug()
    .then(function(results) {
      return results;
    });
};

exports.getUserActivities = function(userId, n) {
  return User
    .query()
    .where('id', userId)
    .eager('activities.[locDetailsView, sport, creator]')
    .modifyEager('activities', function(builder) {
      builder.orderBy('startTime');
      builder.limit(n);
    })
    .omit(Activity, ['creatorId', 'locationId', 'sportId'])
    .omit(User, ['password', 'email', 'lastLocation', 'bioText'])
    .first()
    .then(function(user) {
      return user.activities;
    });
};

exports.postActivity = function(req, res) {
  Activity.query()
    .insertWithRelated({
      title: req.body.title,
      sportId: req.body.sportId,
      minParticipants: req.body.minParticipants,
      maxParticipants: req.body.maxParticipants,
      status: req.body.status,
      description: req.body.description,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      creatorId: req.user.id,
      location: [{
        name: req.body.locationName,
        streetAddress1: req.body.streetAddress1,
        streetAddress1: req.body.streetAddress2,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        geom: st.geomFromText('Point(' + req.body.latitude + ' ' + req.body.longitude + ')', 4326)
      }],
      users: [{ '#dbRef': req.user.id, status: 'admin' }]
    })
    .then(function(activity) {
      res.json(activity);
    })
    .catch(function(err) {
      console.error('Error posting activity: ', err);
      res.status(500).send('Server error');
    });
};

exports.getUsersFriendsActivities = function(userId, n) {
  // NEED TO DO ORDER BY AND LIMIT AND COMBINE FRIENDS ACTIVITIES
  return User
    .query()
    .eagerAlgorithm(Activity.JoinEagerAlgorithm)
    .where('users.id', userId)
    .eager('friends.activities.[locDetailsView, sport, creator]')
    // .modifyEager('friends.activities', function(builder) {
    //   builder.orderBy('startTime');
    //   builder.limit(n);
    // })
    .pick(Activity, ['title', 'description', 'startTime', 'endTime', 'photoUrl', 'creator'])
    .omit(User, ['password', 'email', 'lastActive', 'lastLocation', 'bioText'])
    .first()
    .debug()
    .then(function(user) {
      return user;
    });
};

exports.getUsersFriendsActivitiesPROBEXAMPLE = function(userId, n) {
  return User
    .query()
    .eagerAlgorithm(Activity.JoinEagerAlgorithm)
    .where('users.id', userId)
    .eager('friends.activities.[locDetailsView, sport, creator]')
    // .modifyEager('friends.activities', function(builder) {
    //   builder.orderBy('startTime');
    //   builder.limit(n);
    // })
    .pick(Activity, ['title', 'description', 'startTime', 'endTime', 'photoUrl', 'creator'])
    .omit(User, ['password', 'email', 'lastActive', 'lastLocation', 'bioText'])
    .first()
    .debug()
    .then(function(user) {
      return user;
    });
};

exports.getActivityById = function(id) {
  return Activity
    .query()
    .where('id', id)
    .eager('[locDetailsView, sport, creator, users]')
    .omit(Activity, ['creatorId', 'locationId', 'sportId'])
    .pick(User, ['id', 'username', 'firstName', 'lastName', 'profileUrl', 'status', 'lastActive'])
    .first()
    .then(function(activity) {
      return activity;
    });
};

exports.getProfileByIdOrUsername = function(idOrUsername) {
  var queryField = isNaN(Number(idOrUsername)) ? 'username' : 'id';
  return User
    .query()
    .where(queryField, idOrUsername)
    .eager('[interests, activities.[creator, sport]]')
    .modifyEager('activities', function(builder) {
      builder.where('startTime', '>=', moment());
      builder.orderBy('startTime');
      builder.limit(10);
    })
    .omit(User, ['password', 'email', 'lastLocation'])
    .omit(Activity, ['sportId,', 'minParticipants', 'maxParticipants', 'locationId'])
    .then(function(resultArr) {
      return resultArr[0];
    });
};

exports.getUserFriendsByIdOrUsername = function(idOrUsername) {
  var queryField = isNaN(Number(idOrUsername)) ? 'username' : 'id';
  return User
    .query()
    .where(queryField, idOrUsername)
    .eager('friends')
    .omit(User, ['password', 'email', 'lastLocation', 'bioText'])
    .first()
    .then(function(user) {
      return user.friends;
    });
};



//------------------------------------------------
//                  SPORTS
//------------------------------------------------

exports.getSports = function(req, res) {
  Sport
    .query()
    .then(function(sports) {
      res.json(sports);
    })
    .catch(function(err) {
      console.error('get Sports err:', err);
      res.status(500).send('Server error');
    });
};
