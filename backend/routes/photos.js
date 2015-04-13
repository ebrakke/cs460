var express = require('express');
var photos = express.Router();
var pc = require('../controllers/PhotoCtrl');

photos.get('/:photo_id', function(req, res) {
    var photo = req.params.photo_id;
    pc.getPhoto(photo, function(err, response) {
        if(!err) {
            res.json(response);
        } else {
            res.json(err);
        }
    });
});
