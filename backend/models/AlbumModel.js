var db = require('../controllers/dbConnector');

function Album(albumData) {
    this.album_id = albumData.album_id;
    this.name = albumData.name;
    this.owner = albumData.owner;
    this.createdAt = albumData.createdAt;
}

Album.prototype.create = function() {
    var response = db.query("INSERT INTO albums (name, owner, date_created) VALUES (?, ?, current_date)", {replacements: [this.name, this.owner], type: 'INSERT'});
    return response;
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
