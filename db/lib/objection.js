var objection = require('objection');
var knex = require('./db.js');

var Model = objection.Model;
Model.knex(knex);

module.exports = Model;