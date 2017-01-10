var Model = require('../lib/objection.js');

class Activity extends Model {
  static get tableName() {
    return 'activities';
  }
}

Activity.relationMappings = {
  users: {
    relation: Model.ManyToManyRelation,
    modelClass: __dirname + '/User',
    join: {
      from: 'activities.id',
      through: {
        from: 'users_activities.activityId',
        to: 'users_activities.userId',
        extra: ['status']
      },
      to: 'users.id'
    }
  },
  creator: {
    relation: Model.BelongsToOneRelation,
    modelClass: __dirname + '/User',
    join: {
      from: 'activities.creatorId',
      to: 'users.id'
    }
  },
  sport: {
    relation: Model.BelongsToOneRelation,
    modelClass: __dirname + '/Sport',
    join: {
      from: 'activities.sportId',
      to: 'sports.id'
    }
  },
  location: {
    relation: Model.BelongsToOneRelation,
    modelClass: __dirname + '/Location',
    join: {
      from: 'activities.locationId',
      to: 'locations.id'
    }
  },
  locDetailsView: {
    relation: Model.BelongsToOneRelation,
    modelClass: __dirname + '/LocDetailsView',
    join: {
      from: 'activities.locationId',
      to: 'loc_details_view.id'
    }
  }
};

module.exports = Activity;