var express = require('express');
var user = express.Router();
var uc = require('../controllers/UserCtrl');
var ac = require('../controllers/AuthCtrl');

/* Create a user */
user.post('/create', function(req, res) {
    var userData = req.body;
    uc.create(userData, function(err, response) {
        if (!err) {
            res.cookie('auth', response.auth, {httpOnly: true, path:'/'});
            res.redirect('/');
        } else {
            res.json(err);
        }
    });
});

/* Add a friend */
user.post('/friend', function(req, res) {
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

/* Login a user */
user.post('/login', function(req, res) {
    var userInfo = req.body;
    ac.validByUserPwd(userInfo, function(err, user) {
        if (!err) {
            res.cookie('auth', user.authToken, {httpOnly: true, path:'/'});
            res.redirect('/');
        } else {
            res.json(err);
        }
    });
});

user.get('/logout', function(req, res) {
    res.clearCookie('auth', {path: '/'});
    res.redirect('/');
})

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
