var db = require('../controllers/dbConnector');

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
        callback(null,query);
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
    return response;
}

Album.getPhotosById = function(id) {
    var response = db.query("SELECT path, caption, photo_id from photos where album_id = ?", {replacements: [id]});
    return response;
}

module.exports = Album;
