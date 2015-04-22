var express = require('express');
var pc = require('../controllers/PhotoCtrl');
var photo = express.Router();

photo.get('/:photo_id', function(req, res) {
    var photo = req.params.photo_id;
    pc.getPhoto(photo, function(err, photo) {
        if(err) { res.redirect('/somethingwentwrong?type=get_photo')}
        else{ res.render('photo', {photo: photo}) }
    });
});

module.exports = photo;
