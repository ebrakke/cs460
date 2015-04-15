var db = require('../controllers/dbConnector');

function Photo(photoInfo) {
    this.albumId = photoInfo.album;
    this.caption = photoInfo.caption;
    this.path = photoInfo.path;
    this.tags = photoInfo.tags;
    this.photoId = photoInfo.photoId;
}

Photo.prototype.create = function() {
    var response = db.query("INSERT INTO photos (album_id, caption, path) VALUES (?, ?, ?)", {replacements: [this.albumId, this.caption, this.path], type: 'INSERT'});
    return response;
}

Photo.prototype.getId = function() {
    var response = db.query("SELECT photo_id from photos where path = ?", {replacements: [this.path]});
    return response;
}

Photo.prototype.linkTag = function(tag) {
    var response = db.query("INSERT INTO has_tag (photo_id, tag) VALUES (?, ?)", {replacements: [this.photoId, tag], type: 'INSERT'});
    return response;
}

Photo.insertTag = function(tag) {
    var response = db.query("INSERT INTO tags (tag) VALUES (?)", {replacements: [tag], type: 'INSERT'});
    return response;
}

Photo.getPath = function(id) {
    var response = db.query("SELECT path from photos where photo_id = ?", {replacements:[id]});
}

module.exports = Photo;
