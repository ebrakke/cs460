var AlbumModel = require('../models/AlbumModel');
var ac = require('./AuthCtrl');
var pc = require('./PhotoCtrl');

var AlbumCtrl = function() {};

AlbumCtrl.create = function(authToken, photoInfo, callback) {
    ac.validByAuthToken(authToken, function(err, user) {
        if(!err) {
            var albumInfo = {};
            albumInfo.owner = user.uid;
            albumInfo.name = photoInfo.name;
            var Album = new AlbumModel(albumInfo);

            var response = Album.create();
            response.then(function() {

                var response = Album.getId();
                response.then(function(id) {
                    Album.album_id = id[0][0].album_id;
                    photoInfo.album = Album.album_id;
                    pc.add(photoInfo, function(err, response) {

                        if(!err) {
                            var response = Album.getPhotos();
                            response.then(function(photos){

                                Album.photos = photos[0]; // List of caption, path, id
                                callback(null, Album);
                            }, function(err) {
                                callback(err, null);
                            });
                        } else {
                            callback(err, null);
                        }
                    });
                }, function(err) {
                    callback(err, null);
                });
            });
        } else {
            callback(err, null);
        }
    });
}

AlbumCtrl.getPhotos = function(albumId, callback) {
    console.log(albumId);
    var response = AlbumModel.getPhotosById(albumId);
    response.then(function(photos) {
        callback(null, photos[0]);
    }, function(err) {
        callback(err, null);
    });
}

module.exports = AlbumCtrl;
