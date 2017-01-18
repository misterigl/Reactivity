var knex = require('./lib/db.js');
var st = knex.postgis;
var moment = require('moment');

var Activity = require('./models/Activity.js');
var User = require('./models/User.js');
var Sport = require('./models/Sport.js');
var LocDetailsView = require('./models/LocDetailsView.js');


exports.activitiesNearby = function(lat, long, n, sportIdsArr, startTime, endTime) {
  var lat = lat.toString();
  var long = long.toString();
  return Activity
    .query()
    // .select(
    //   'activities.id', 'activities.title', 'activities.minParticipants', 
    //   'activities.maxParticipants', 'activities.status', 'activities.description', 
    //   'activities.startTime', 'activities.endTime', 'activities.photoUrl', 
    //   LocDetailsView.raw(st.distance('locDetailsView.geom', st.geomFromText('Point(' + lat + ' ' + long + ')', 4326)))
    // )
    .select('activities.*', LocDetailsView.raw(st.distance(st.geography(st.transform('locDetailsView.geom', 4326)), st.geography(st.transform(st.geomFromText('Point(' + lat + ' ' + long + ')', 4326), 4326)))))
    .modify(function(builder) {
      if (sportIdsArr) {
        builder.whereIn('sportId', sportIdsArr);
      }
      builder.where('startTime', '>=', startTime);
      if (endTime) {
        builder.where('endTime', '<=', endTime);
      }
    })
    .eagerAlgorithm(Activity.JoinEagerAlgorithm)
    .eager('[locDetailsView, sport, creator]')
    // .modifyEager('locDetailsView', function(builder) {
    //   // builder.select('*', st.distance('geom', st.geomFromText('Point(' + lat + ' ' + long + ')', 4326)));
    //   builder.select('*', LocDetailsView.raw(st.distance('loc_details_view.geom', st.geomFromText('Point(' + lat + ' ' + long + ')', 4326))));
    // })
    .orderByRaw('"locDetailsView"."geom" <-> ' + st.geomFromText('Point(' + lat + ' ' + long + ')', 4326) + '::geometry')
    // .orderByRaw('"locDetailsView"."geom" <-> SRID=4326;POINT(' + lat + ' ' + long + ')::geometry')
    .omit(Activity, ['creatorId', 'locationId', 'sportId'])
    .omit(User, ['password', 'email', 'lastLocation', 'bioText'])
    .debug()
    .limit(n)
    .then(function(results) {
      return results;
    });
};

exports.getUserActivities = function(userId, n, sportIdsArr, startTime, endTime) {
  return User
    .query()
    .where('id', userId)
    .eager('activities.[locDetailsView, sport, creator]')
    .modifyEager('activities', function(builder) {
      if (sportIdsArr) {
        builder.whereIn('sportId', sportIdsArr);
      }
      builder.where('startTime', '>=', startTime);
      if (endTime) {
        builder.where('endTime', '<=', endTime);
      }
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

exports.getUsersFriendsActivities = function(userId, n, sportIdsArr, startTime, endTime) {
  return User
    .query()
    .where('id', userId)
    .eager('friendsActivities.[creator]')
    .modifyEager('friendsActivities', function(builder) {
      if (sportIdsArr) {
        builder.whereIn('sportId', sportIdsArr);
      }
      builder.where('startTime', '>=', startTime);
      if (endTime) {
        builder.where('endTime', '<=', endTime);
      }
      builder.orderBy('startTime');
      builder.limit(n);
    })
    .pick(User, ['id', 'username', 'firstName', 'lastName', 'profileUrl', 'friendsActivities'])
    .omit(Activity, ['minParticipants', 'maxParticipants', 'locationId'])
    .first()
    .then(function(user) {
      return user.friendsActivities;
    });
};

exports.getActivityById = function(id, loggedInUserId) {
  return Activity
    .query()
    .where('id', id)
    .eager('[locDetailsView, sport, creator, users.[friendsUniDir, friends, friendRequestsToAccept]]')
    .modifyEager('users.friends', function(builder) {
      builder.where('friendId', loggedInUserId);
    })
    // If not friends, but friendsUniDir -> user profile being looked up has sent friend request to logged in user
    .modifyEager('users.friendsUniDir', function(builder) {
      builder.where('friendId', loggedInUserId);
    })
    .modifyEager('users.friendRequestsToAccept', function(builder) {
      builder.where('userId', loggedInUserId);
    })
    .omit(Activity, ['creatorId', 'locationId', 'sportId'])
    .pick(User, ['id', 'username', 'firstName', 'lastName', 'profileUrl', 'status', 'lastActive', 'friendsUniDir', 'friends', 'friendRequestsToAccept'])
    .first()
    .then(function(activity) {
      activity.users = activity.users.map(function(user) {
        if (user.friends.length > 0) {
          user.relationship = 'friend';
        } else if (user.friendsUniDir.length > 0) {
          user.relationship = 'inboundFriendReqToAcceptOrDelete';
        } else if (user.friendRequestsToAccept.length > 0) {
          user.relationship = 'outboundFriendReqPending';
        } else {
          user.relationship = null;
        }
        delete user.friends;
        delete user.friendRequestsToAccept;
        delete user.friendsUniDir;
        return user;
      });
      return activity;
    });
};

exports.getProfileByIdOrUsername = function(idOrUsername, loggedInUserId) {
  var queryField = isNaN(Number(idOrUsername)) ? 'username' : 'id';
  return User
    .query()
    .where(queryField, idOrUsername)
    .eager('[friendsUniDir, friends, friendRequestsToAccept, interests, activities.[creator, sport]]')
    .modifyEager('activities', function(builder) {
      builder.where('startTime', '>=', moment());
      builder.orderBy('startTime');
      builder.limit(10);
    })
    .modifyEager('friends', function(builder) {
      builder.where('friendId', loggedInUserId);
    })
    // If not friends, but friendsUniDir -> user profile being looked up has sent friend request to logged in user
    .modifyEager('friendsUniDir', function(builder) {
      builder.where('friendId', loggedInUserId);
    })
    .modifyEager('friendRequestsToAccept', function(builder) {
      builder.where('userId', loggedInUserId);
    })
    .omit(User, ['password', 'email', 'lastLocation'])
    .omit(Activity, ['sportId,', 'minParticipants', 'maxParticipants', 'locationId'])
    .first()
    .then(function(user) {
      if (user.friends.length > 0) {
        user.relationship = 'friend';
      } else if (user.friendsUniDir.length > 0) {
        user.relationship = 'inboundFriendReqToAcceptOrDelete';
      } else if (user.friendRequestsToAccept.length > 0) {
        user.relationship = 'outboundFriendReqPending';
      } else {
        user.relationship = null;
      }
      delete user.friendsUniDir;
      delete user.friendRequestsToAccept;
      delete user.friends;
      return user;
    });
};

//************************************************
//                   FRIENDS
//************************************************

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

exports.getFriendRequests = function(req, res) {
  User
    .query()
    .where('id', req.user.id)
    .eager('friendRequestsToAccept')
    .omit(User, ['password', 'email', 'lastLocation', 'bioText'])
    .first()
    .then(function(user) {
      res.json(user.friendRequestsToAccept);
    })
    .catch(function(err) {
      console.error('Get friend requests error: ', err);
    });
};

var checkPendingFriendRequest = function(requesteeId, requesterId) {
  // Returns array of length 2:
    // Index 0: true/false request exists
    // Index 1: requestee objection user model instance
  return User
    .query()
    .where('id', requesteeId)
    .eager('friendRequestsToAccept')
    .modifyEager('friendRequestsToAccept', function(builder) {
      builder.where('id', requesterId);
    })
    .first()
    .then(function(user) {
      return [user.friendRequestsToAccept.length > 0, user];
    });
};

exports.acceptFriendRequest = function(req, res) {
  checkPendingFriendRequest(req.user.id, req.params.id)
  .spread(function(exists, requestee) {
    if (!exists) { throw 'Error: no pending friend request for that id'; }

    return requestee.$relatedQuery('friendsUniDir').relate(req.params.id);
  })
  .then(function(requestee) {
    console.log(requestee);
    res.send('Success');
  })
  .catch(function(err) {
    res.status(403).send(err);
  })
  .error(function(err) {
    console.error('Server error: ', err);
    res.status(500).send('Server error');
  });
};

exports.deleteFriendRequest = function(req, res) {
  checkPendingFriendRequest(req.user.id, req.params.id)
  .spread(function(exists, requestee) {
    if (!exists) { throw 'Error: no pending friend request for that id'; }

    return requestee.$relatedQuery('friendRequestsToAccept').unrelate().where('userId', req.params.id);
  })
  .then(function() {
    res.send('Success');
  })
  .catch(function(err) {
    res.status(403).send(err);
  })
  .error(function(err) {
    console.error('Server error: ', err);
    res.status(500).send('Server error');
  });
};

exports.makeFriendRequest = function(req, res) {
  User
    .query()
    .where('id', req.user.id)
    .eager('friendsUniDir')
    .modifyEager('friendsUniDir', function(builder) {
      builder.where('friendId', req.params.id);
    })
    .first()
    .then(function(user) {
      if (user.friendsUniDir.length > 0) {
        throw 'Error: friend request already pending or users are already friends';
      }
      return user.$relatedQuery('friendsUniDir').relate(req.params.id);
    })
    .then(function(result) {
      console.log(result);
      res.send('Success');
    })
    .catch(function(err) {
      console.error('Error:', err);
      res.status(400).send(err);
    })
    .error(function(err) {
      console.error('Server error: ', err);
      res.status(500).send('Server error');
    });
};

exports.deleteFriend = function(req, res) {
  var friendId = req.params.id;
  var userId = req.user.id;
  User
    .query()
    .where('id', userId)
    .first()
    .then((user) => {
      return user.$relatedQuery('friends').unrelate().where('friendId', friendId);
    })
    .then((found) => { res.send('Success'); })
    .catch((err) => { res.status(500).send('Server error', err); });
};

//************************************************
//                   SIGNUP
//************************************************

exports.signupUser = function(req, res) {
  User.query()
    .insertWithRelated({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bioText: req.body.bioText,
      locations: [{
        name: req.body.homeLocation.name,
        streetAddress1: req.body.homeLocation.streetAddress1,
        streetAddress2: req.body.homeLocation.streetAddress2,
        city: req.body.homeLocation.city,
        state: req.body.homeLocation.state,
        postalCode: req.body.homeLocation.postalCode,
        geom: st.geomFromText('Point(' + req.body.homeLocation.latitude + ' ' + req.body.homeLocation.longitude + ')', 4326),
        locationName: 'home'
      }],
      interests: req.body.interests.map(function(interestId) {
        return { '#dbRef': interestId };
      })
    })
    .then(function(user) {
      res.status(201).send('Success');
    })
    .catch(function(err) {
      if (err.constraint === 'users_username_unique') {
        res.status(409).send('This username is taken. Please try a different username.');
      } else if (err.constraint === 'users_email_unique') {
        res.status(409).send('An account with this email address already exists. Did you forget your password?');
      } else {
        res.status(500).send('Server error');
      }
    });
};


//************************************************
//                   SPORTS
//************************************************

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
