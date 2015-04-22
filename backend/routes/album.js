var express = require('express');
var album = express.Router();
var ac = require('../controllers/AlbumCtrl');

album.post('/', function(req, res) {
    var auth = req.cookies.auth;
    var albumInfo = {name: req.body.name};
    var photoInfo = {caption: req.body.caption, tags: req.body.tags.split(','), path: req.files.photoFile.path}
    ac.create(auth, albumInfo, photoInfo, function(err, album) {
        if(!err){
            res.redirect('/album/' + album.album_id);
        } else {
            res.redirect('/somethingwentwrong?type=upload_photo');
        }
    });
});

album.post('/add', function(req, res) {
    var auth = req.cookies.auth;
    var albumInfo = {album_id: req.body.name}
    var photoInfo = {caption: req.body.caption, tags: req.body.tags.split(','), path: req.files.photoFile.path}
    ac.add(auth, albumInfo, photoInfo, function(err, photo) {
        if (err) { res.redirect('/somethingwentwrong?type=upload_photo')}
        else { res.redirect('/photo/' + photo.photo_id)}
    })
})

album.get('/:albumId', function(req, res) {
    var albumId = req.params.albumId;
    ac.getPhotos(albumId, function(err, photos) {
        var album = {}
        album.photos = photos;
        res.render('album', {album: album});
    })
})

module.exports = album;
