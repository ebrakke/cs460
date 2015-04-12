var express = require('express');
var user = express.Router();
var uc = require('../controllers/UserCtrl');

/* Create a user */
user.post('/', function(req, res) {
    var userData = req.body;
    uc.create(userData, function(err, response) {
        if (!err) {
            res.json(response);
        } else {
            res.json(err);
        }
    });
});

/* Add a friend */
user.post('/friend', function(err, response) {
    var username = req.body.username;
    var friend = req.body.friend;
    uc.friend(username, friend, function(err, response) {
        if (!err) {
            res.json(response);
        } else {
            res.json(err);
        }
    });
});

/* Get a user */
user.get('/:username', function(req, res) {
    var username = req.params.username;
    uc.getUser(username, function (err, response) {
        if (!err) {
            res.json(response)
        } else {
            res.json(err);
        }
    });
});

/* Get a users friends */
user.get('/:username/friends', function(req, res) {
    var username = req.params.username;
    uc.getFriends(username, function(err, response) {
        if(!err) {
            res.json(response);
        } else {
            res.json(err);
        }
    });
});



module.exports = user;
