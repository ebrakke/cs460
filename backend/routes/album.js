var express = require('express');
var album = express.Router();
var ac = require('../controllers/AlbumCtrl');

album.post('/', function(req, res) {
    var auth = req.cookies.auth;
    var photoInfo = req.body;
    photoInfo.path = req.files.photoFile.path;
    ac.create(auth, photoInfo, function(err, album) {
        if(!err){
            res.render('album', {album: album});
        } else {
            res.redirect('/somethingwentwrong?type=upload_photo');
        }
    });

});

album.get('/:albumId', function(req, res) {
    var albumId = req.params.albumId;
    ac.getPhotos(albumId, function(err, photos) {
        var album = {}
        album.photos = photos;
        res.render('album', {album: album});
    })
})

module.exports = album;
