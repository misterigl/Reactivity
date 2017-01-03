var Model = require('../lib/objection.js');

class Activity extends Model {
  static get tableName() {
    return 'activities';
  }
}

module.exports = Activity;