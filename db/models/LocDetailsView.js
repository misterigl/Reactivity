var Model = require('../lib/objection.js');

class LocDetailsView extends Model {
  static get tableName() {
    return 'loc_details_view';
  }
}

module.exports = LocDetailsView;