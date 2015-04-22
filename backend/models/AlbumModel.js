var db = require('../controllers/dbConnector');
var pm = require('./PhotoModel');

function Album(albumInfo) {
    this.album_id = albumInfo.album_id;
    this.name = albumInfo.name;
    this.owner = albumInfo.owner;
    this.createdAt = albumInfo.createdAt;
}

Album.prototype.create = function(callback) {
    var album = this;
    var response = db.query("INSERT INTO albums (name, owner, date_created) VALUES (?, ?, current_date)", {replacements: [album.name, album.owner], type: 'INSERT'});
    response.then(function() {
        var query = db.query("SELECT album_id, name, owner, date_created from albums where name= ? and owner = ?", {replacements: [album.name, album.owner]})
        query.then(function(response) {
            var albums = Album.createModelObject(response);
            callback(null, albums);
        });
    }, function(err) {
        return callback(err, null);
    });

}

Album.prototype.getId = function() {
    var response = db.query("SELECT album_id from albums where name = ? and owner = ?", {replacements: [this.name, this.owner]});
    return response;
}

Album.prototype.getPhotos = function() {
    var response = db.query("SELECT path, caption, photo_id from photos where album_id = ?", {replacements: [this.album_id]});
    response.then(function(photos) {
        var photos = photos[0];
        var models;
        for (photo in photos) {
            models.push(new pm(photos[photo]));
        }
        return models;
    });
}

Album.getPhotosById = function(id) {
    var response = db.query("SELECT path, caption, photo_id from photos where album_id = ?", {replacements: [id]});
    return response;
}

Album.createModelObject = function(response) {
    var raw = response[0];
    var albums;
    for (album in raw) {
        a = new Album(raw[album]);
        albums.push(a);
    }
    return albums
}

module.exports = Album;
