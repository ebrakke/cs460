var ac = require('./AuthCtrl');
var PhotoModel = require('../models/PhotoModel');

var PhotoCtrl = function() {}

PhotoCtrl.add = function(photoInfo, callback) {
    var Photo = new PhotoModel(photoInfo);
    var response = Photo.create();
    response.then(function() {
        var response = Photo.getId();
        response.then(function(data) {
            Photo.photoId = data[0][0].photo_id;
            var tags = Photo.tags.split(',');
            for (tag in tags) {
                var response = PhotoModel.insertTag(tags[tag]);
                response.then(function() {
                    var response = Photo.linkTag(tags[tag]);
                    response.then(function() {}, function(err) {callback(err, null)});
                });
            }
            callback(null, null);
        });
    });

}

module.exports = PhotoCtrl;
