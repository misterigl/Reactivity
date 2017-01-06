// Make knex connection to db and export
var config = require('../../knexfile.js');
var env = process.env.NODE_ENV || 'development';
var knex = require('knex')(config[env]);
require('knex-postgis')(knex);

// knex-postgis functions available at knex.postgis (st = knex.postgis)

module.exports = knex;