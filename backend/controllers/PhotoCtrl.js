var ac = require('./AuthCtrl');
var PhotoModel = require('../models/PhotoModel');

var PhotoCtrl = function() {}

PhotoCtrl.add = function(photoInfo, albumInfo, callback) {
    photoInfo.album_id = albumInfo.album_id;
    var Photo = new PhotoModel(photoInfo);
    Photo.create(function() {
        Photo.insertTagsAndLink();
        callback(null, Photo);
    });
}

PhotoCtrl.getRecent = function(callback) {
    var photos = [];
    var response = PhotoModel.getRecent();
    response.then(function(query) {
        var raw_photos = query[0];
        raw_photos.forEach(function(p) {
            var photo = new PhotoModel(p);
            photo.getTags(function() {
                photos.push(photo);
                if(photos.length === raw_photos.length) {
                    callback(null, photos);
                }
            });
        })
    });
}

PhotoCtrl.getPhoto = function(photo_id, callback) {
    PhotoModel.getById(photo_id, function(photo) {
        photo.getTags(function() {
            callback(null, photo);
        })
    })
}

module.exports = PhotoCtrl;
