var prompt = require('prompt');
var knex = require('./db.js');
var Promise = require('bluebird');
var colors = require('colors/safe');




knex.migrate.status()
.then(promptMigrate)
.then(function(migrate) {
  if (migrate === 'upToDate') {
    return null;
  } else if (migrate) {
    console.log('\nPerforming migration...');
    return knex.migrate.latest();
  } else {
    console.log('\nYou may migrate to the latest database version at a later time with:');
    console.log(colors.cyan('  knex migrate:latest'));
    return null;
  }
})
.then(function(result) {
  if (result) {
    console.log(colors.green('Migration complete!'));
    console.log('To rollback:', colors.cyan('knex migrate:rollback'));
  }
  return knex.migrate.currentVersion();
})
.then(function(version) {
  console.log('\nDatabase migration id:', colors.magenta(version) + '\n');
})
.catch(function(err) {
  console.error('\nMigration error:', err + '\n');
})
.finally(function() {
  return knex.destroy();
});


function promptMigrate(status) {
  return new Promise(function(resolve, reject) {
    if (status < 0) {
      var words = status === -1 ? ['is ', 'migration.'] : ['are ', 'migrations.'];
      prompt.start();
      prompt.message = '';
      prompt.get([
        { name: 'migrate',
          description: colors.red('There ' + words[0] + Math.abs(status) + ' pending database ' + words[1] + ' Do you want to update now? (Y/N)'),
        }
      ], function(err, results) {
        if (err) { 
          reject(err); 
        } else {
          var res = results.migrate.trim().toLowerCase();
          resolve(res === 'yes' || res === 'y');
        }
      });
    } else {
      resolve('upToDate');
    }
  });
}

