var Model = require('../lib/objection.js');

class Location extends Model {
  static get tableName() {
    return 'locations';
  }
}

Location.relationMappings = {
  activities: {
    relation: Model.HasManyRelation,
    modelClass: __dirname + '/Activity',
    join: {
      from: 'locations.id',
      to: 'activities.id'
    }
  }
};

module.exports = Location;