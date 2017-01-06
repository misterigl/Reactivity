var Model = require('../lib/objection.js');

class Sport extends Model {
  static get tableName() {
    return 'sports';
  }
}

Sport.relationMappings = {
  activities: {
    relation: Model.HasManyRelation,
    modelClass: __dirname + '/Activity',
    join: {
      from: 'sports.id',
      to: 'activities.sportId'
    }
  },
  interestedUsers: {
    relation: Model.ManyToManyRelation,
    modelClass: __dirname + '/User',
    join: {
      from: 'sports.id',
      through: {
        from: 'interests.sportId',
        to: 'interests.userId'
      },
      to: 'users.id'
    }
  }
};

module.exports = Sport;