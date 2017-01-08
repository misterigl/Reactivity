var Model = require('../lib/objection.js');
var Promise = require('bluebird');
var bcrypt = require('bcryptjs');
bcrypt.hash = Promise.promisify(bcrypt.hash);


class User extends Model {
  static get tableName() {
    return 'users';
  }

  $beforeInsert(options, context) {
    return bcrypt.hash(this.password, 10)
    .bind(this)
    .then(function(hash) {
      this.password = hash;
      return;
    })
    .catch(function(err) {
      console.error('Error hashing password:', err);
    });
  }
  $beforeUpdate(options, context) {
    return bcrypt.hash(this.password, 10)
    .bind(this)
    .then(function(hash) {
      this.password = hash;
      return;
    })
    .catch(function(err) {
      console.error('Error hashing password:', err);
    });
  }
}

User.relationMappings = {
  activities: {
    relation: Model.ManyToManyRelation,
    modelClass: __dirname + '/Activity',
    join: {
      from: 'users.id',
      through: {
        from: 'users_activities.userId',
        to: 'users_activities.activityId',
        extra: ['status']
      },
      to: 'activities.id'
    }
  },
  locations: {
    relation: Model.ManyToManyRelation,
    modelClass: __dirname + '/Location',
    join: {
      from: 'users.id',
      through: {
        from: 'users_locations.userId',
        to: 'users_locations.locationId',
        extra: ['locationName']
      },
      to: 'locations.id'
    }
  },
  interests: {
    relation: Model.ManyToManyRelation,
    modelClass: __dirname + '/Sport',
    join: {
      from: 'users.id',
      through: {
        from: 'interests.userId',
        to: 'interests.sportId'
      },
      to: 'sports.id'
    }
  },
  friendsUniDir: {
    relation: Model.ManyToManyRelation,
    modelClass: User,
    join: {
      from: 'users.id',
      through: {
        from: 'friendships.userId',
        to: 'friendships.friendId'
      },
      to: 'users.id'
    }
  },
  friends: {
    relation: Model.ManyToManyRelation,
    modelClass: User,
    join: {
      from: 'users.id',
      through: {
        from: 'friends.userId',
        to: 'friends.friendId'
      },
      to: 'users.id'
    }
  }
};

module.exports = User;