'use strict';

var bcrypt = require('bcryptjs');
var UserModel = require('../models/UserModel');

/* AuthCtrl Constructor */
var AuthCtrl = function () {};

/* Validate a supplied username and password */
AuthCtrl.validByUserPwd = function(userData, callback) {
	var hash = UserModel.getHash(userData.username);  // Grab the password hash from the DB
	hash.then(function(result) {
		if (!result[0][0]) {
			callback('error', null);
		} else {
		var hash = result[0][0].password
		/* Check that the password and the hash match */
		if(bcrypt.compareSync(userData.password, hash)){
			var response = UserModel.getByUsername(userData.username);
			/* Get the current user object */
			response.then(function(user) {
				var User = new UserModel(user[0][0]);
				var response = User.getAuthToken(User.uid);
				/* Get the auth token */
				response.then(function(authToken) {
					User.auth = authToken[0][0].authtoken;
					callback(null,{username:User.username, email:User.email, uid:User.uid, authToken:User.auth});
				});
			});

		/* Password did not match */
		} else {
			callback(err, null);
		}
	}
	});
}

AuthCtrl.validByAuthToken = function(authtoken, callback){
	var response = UserModel.getByAuthToken(authtoken);
	response.then(function(result) {
		var user = result[0][0];
		if (!user) {
			callback('error', null);
		} else {
			callback(null, user);
		}
	}, function(err) {
		callback(err, null);
	});
}

module.exports = AuthCtrl;
