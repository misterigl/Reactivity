var Model = require('../lib/objection.js');

class User extends Model {
  static get tableName() {
    return 'users';
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
  }
};

module.exports = User;