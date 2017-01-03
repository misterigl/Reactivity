var Model = require('../lib/objection.js');

class User extends Model {
  static get tableName() {
    return 'users';
  }
}

module.exports = User;