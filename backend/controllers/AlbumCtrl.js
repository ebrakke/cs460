var AlbumModel = require('../models/AlbumModel');
var ac = require('./AuthCtrl');
var pc = require('./PhotoCtrl');
var uc = require('./UserCtrl');

var AlbumCtrl = function() {};

AlbumCtrl.create = function(authToken, albumInfo, photoInfo, callback) {
    ac.validByAuthToken(authToken, function(err, user) {
        if (err) { callback(err, null) }
        else {
            albumInfo.owner = user.uid;
            var album = new AlbumModel(albumInfo);
            var request = album.create(function(err, request) {
                if(err) { callback(err.message, null)}
                else{
                    request.then(function(album) {
                        albumInfo.album_id = album[0][0].album_id;
                        uc.increment(user.uid);
                        pc.add(photoInfo, albumInfo, function(err, response) {
                            if (err) { callback(err, null) }
                            else{ callback(null, albumInfo) }
                        });
                    })
                }
            });
        }
    });
}

AlbumCtrl.add = function(authToken, albumInfo, photoInfo, callback) {
    ac.validByAuthToken(authToken, function(err, user) {
        if (err) {callback(err, null)}
        else{
            uc.increment(user.uid);
            pc.add(photoInfo, albumInfo, function(err, response) {
                if(err) { callback(err, null) }
                else { callback(null, response) }
            });
        }
    })
}
AlbumCtrl.getPhotos = function(album_id, callback) {
    var album = new AlbumModel({album_id: album_id})
}

module.exports = AlbumCtrl;
