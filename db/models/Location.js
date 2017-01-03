var Model = require('../lib/objection.js');

class Location extends Model {
  static get tableName() {
    return 'locations';
  }
}

module.exports = Location;