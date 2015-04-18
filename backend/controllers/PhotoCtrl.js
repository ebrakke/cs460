var ac = require('./AuthCtrl');
var PhotoModel = require('../models/PhotoModel');

var PhotoCtrl = function() {}

PhotoCtrl.add = function(photoInfo, albumInfo, callback) {
    var Photo = new PhotoModel(photoInfo, albumInfo);
    Photo.create(function(err, response) {
        if (err) {callback(err.message, null)}
        else {
            response.then(function(photo){
                Photo.photo_id = photo[0][0].photo_id;
                Photo.insertTagsAndLink();
                callback(null, null);
            });
        }
    });
}

PhotoCtrl.getTags = function(photo_id, callback) {
    var response = PhotoModel.getTags(photo_id);
    response.then(function(tags) {
        callback(null, tags[0]);
    })
}

PhotoCtrl.getAlbumPhotos = function(album_id, callback) {
    var response = PhotoModel.getPhotoByAlbum(album_id);
    response.then(function(res) {
        var photos = res[0];
        var count = 0;
        for (photo in photos) {
            PhotoCtrl.getTags(photos[photo].photo_id, function(err, tags) {
                if (err) {callback(err, null)}
                else {
                    photos[count].tags = tags;
                    if (count == photos.length - 1){ console.log(photos); callback(null, photos)}
                    count++;
                }
            })
        }
    })
}


PhotoCtrl.getRecent = function(callback) {
    var response = PhotoModel.getRecent();
    response.then(function(photos) {
        callback(null, photos[0])
    })
}

module.exports = PhotoCtrl;
