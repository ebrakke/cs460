var express = require('express');
var router = express.Router();
var ac = require('../controllers/AuthCtrl');

/* GET home page. */
router.get('/', function(req, res, next) {
    var auth = req.cookies.auth;
    if(auth) {
        ac.validByAuthToken(auth, function(err, user) {
            if(!err) {
                res.render('index', { userInfo: user});
            } else {
                res.clearCookie('auth');
                res.redirect('/login');
            }
        })
    } else {
        res.render('index');
    }
});

/* Login page */
router.get('/login', function(req, res) {
    if (req.query.error){
        res.render('login', {error: 'Invalid username or password', username: req.query.username});
    } else {
        res.render('login', {});
    }
});

/* Signup page */
router.get('/create', function(req, res) {
    res.render('create', {});
});

/* Generic success page */
router.get('/success', function(req, res) {
    res.render('success', {})
});

/* For when things just don't go the user's way */
router.get('/somethingwentwrong', function(req, res) {
    var type = req.query.type
    res.render('failure', {type: type});
});

router.get('/upload', function(req, res) {
    res.render('upload', {albums: []});
})


module.exports = router;
