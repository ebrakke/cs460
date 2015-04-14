var express = require('express');
var user = express.Router();
var uc = require('../controllers/UserCtrl');
var ac = require('../controllers/AuthCtrl');

/* Create a user */
user.post('/create', function(req, res) {
    var userData = req.body;
    uc.create(userData, function(err, response) {
        if (!err) {
            res.cookie('auth', response._auth, {httpOnly: true, path:'/'});
            res.redirect('/');
        } else {
            res.json(err);
        }
    });
});

/* Add a friend */
user.post('/friend', function(req, res) {
    var auth = req.cookies.auth;
    var friend = req.body.friend;
    uc.addFriend(auth, friend, function(err, response) {
        if(!err) {
            res.redirect('/success');
        } else {
            switch (err) {
                case 1:
                    res.redirect('/somethingwentwrong?type=friend');
                    break;
                case 2:
                    res.clearCookie('auth');
                    res.redirect('/login')
                    break;
                default:
                    res.redirect('/somethingwentwrong?type=unknown');
            }
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
            res.redirect('/login?error=1&username=' + userInfo.username);
        }
    });
});

user.get('/logout', function(req, res) {
    res.clearCookie('auth', {path: '/'});
    res.redirect('/');
})

/* Get a users friends */
user.get('/friends', function(req, res) {
    var auth = req.cookies.auth;
    uc.getFriends(auth, function(err, friends) {
        if(!err) {
            res.render('friends', {friends: friends});
        } else {
            res.redirect('/somethingwentwrong?type=show_friends');
        }
    });
});

/* Get a user */
user.get('/:username', function(req, res) {
    var username = req.params.username;
    uc.getByUsername(username, function(err, user) {
        if(!err) {
            res.render('user', {user: user});
        } else {
            //res.redirect('/error?type=viewUser');
        }
    });
});





module.exports = user;
