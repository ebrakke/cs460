var express = require('express');
var router = express.Router();
var ac = require('../controllers/AuthCtrl');

/* GET home page. */
router.get('/', function(req, res, next) {
    var auth = req.cookies.auth;
    if(auth) {
        ac.validByAuthToken(auth, function(err, user) {
            if(!err) {
                console.log(user);
                res.render('index', { userInfo: user});
            }
        })
    } else {
        res.render('index', { title: 'Express' });
    }
});

router.get('/login', function(req, res) {
    res.render('login', {});
})

router.get('/create', function(req, res) {
    res.render('create', {});
});


module.exports = router;
