var UserModel = require('../models/UserModel');
var ac = require('./AuthCtrl');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');


/* UserCtrl Constructor */
var UserCtrl = function () {}


 /* Create a new user
 * Input: userData = {username, password, email}
 * Return: User object with username, email, uid, authToken
 */
UserCtrl.create = function(userData, callback) {
    userData.password = bcrypt.hashSync(userData.password, 8); // Hash the password and forget it

    /* Send the request to create the user */
    var User = new UserModel(userData);
	var response = User.create();
    delete User.password;

    response.then(function(result) {
        /* On a successful insert, get the id and create an auth token */
        var response = User.getId();
        response.then(function(results) {
            /* extract the uid */
            User._uid = results[0][0].uid.toString();  // Extract the ID from the response
            User._auth = crypto.createHash('sha1').update(User._uid).update(Math.random().toString(32).slice(2)).digest('hex');  // Generate a new auth token
            console.log(User._auth);
            var response = User.createAuthToken();  // Put the auth token into the DB
            response.then(function(results) {
                /* Return the user object to the router */
                callback(null, User);

        /* Error handling */
            }, function(err) {
                callback(err, null);
            });
        }, function(err) {
            callback(err, null);
        });
    }, function(err) {
        callback(err, null);
    });
}

UserCtrl.addFriend = function(authToken, friend_id, callback) {
    ac.validByAuthToken(authToken, function(err, user) {
        if(!err) {
            var User = new UserModel(user);
            var response = User.addFriend(parseInt(friend_id))
            response.then(function() {
                callback(null, 'success');
            }, function(err) {
                callback(1, null)
            });
        } else {
            callback(2, null);
        }
    });
}

UserCtrl.getFriends = function(authToken, callback) {
    ac.validByAuthToken(authToken, function(err, user) {
        if (!err) {
            var User = new UserModel(user);
            var response = User.getFriends()
            response.then(function(friends) {
                callback(null, friends[0]);
            }), function(err) {
                callback(err, null)
            };
        } else {
            callback(err, null);
        }
    });
}
/* Get a user by username*/
UserCtrl.getByUsername = function(username, callback) {
    var response = UserModel.getByUsername(username);
    response.then(function(results) {
            if (results[1].rowCount === 0){
                callback(1, null);
            }
            var User = new UserModel(results[0][0]);
            callback(null, User);
    }, function(err) {
        callback(err, null);
    });
}

UserCtrl.getAlbums = function(authToken, callback) {
    ac.validByAuthToken(authToken, function(err, user) {
        if(!err) {
            var response = UserModel.getAlbums(user.uid);
            response.then(function(albums) {
                callback(null, albums[0]);
            })
        }
    })
}

UserCtrl.increment = function(uid) {
    UserModel.increment(uid);
}


module.exports = UserCtrl;
