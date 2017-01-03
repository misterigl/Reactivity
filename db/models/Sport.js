var Model = require('../lib/objection.js');

class Sport extends Model {
  static get tableName() {
    return 'sports';
  }
}

module.exports = Sport;