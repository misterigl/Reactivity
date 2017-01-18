var CognitoIdentity = require('aws-sdk/clients/CognitoIdentity');
var cognitoidentity = new CognitoIdentity({
  region: 'us-east-1'
});
var Promise = require('bluebird');
var getOpenIdTokenForDeveloperIdentity = Promise.promisify(cognitoidentity.getOpenIdTokenForDeveloperIdentity).bind(cognitoidentity);
var localVars = require('./localvars.js');


exports.getCognitoToken = function(userId) {
  var params = {
    // IdentityPoolId: localVars.INDENTITY_POOL_ID,
    IdentityPoolId: localVars.IDENTITY_POOL_ID,
    Logins: {
      'passport.reactivity': userId.toString() 
    },
    // Token valid for 24 hours:
    TokenDuration: 86400
  };
  return getOpenIdTokenForDeveloperIdentity(params);
};
