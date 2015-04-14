var express = require('express');
var album = express.Router();
var authctrl = require('../controllers/AuthCtrl');

album.post('/', function(req, res) {
    var auth = req.cookies.auth;
    var albumName = req.body.albumName;
    var photo = req.files;
    authctrl.validByAuthToken(auth, function(err, user) {
        if(!err) {
            console.log(req.body);
            console.log(req.files);
        }
    })
});

module.exports = album;
