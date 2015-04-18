var db = require('../controllers/dbConnector');

function Photo(photoInfo, albumInfo) {
    this.album_id = albumInfo.album_id;
    this.caption = photoInfo.caption;
    this.path = photoInfo.path;
    this.tags = photoInfo.tags;
    this.photo_id = photoInfo.photo_id;
}

Photo.prototype.create = function(callback) {
    photo = this;
    var insert = db.query("INSERT INTO photos (album_id, caption, path) VALUES (?, ?, ?)", {replacements: [this.album_id, this.caption, this.path], type: 'INSERT'});
    insert.then(function() {
        var query = db.query("SELECT photo_id, album_id, caption, path FROM photos WHERE path = ?", {replacements: [photo.path]});
        callback(null, query);
    });
}

Photo.prototype.getId = function() {
    var response = db.query("SELECT photo_id from photos where path = ?", {replacements: [this.path]});
    return response;
}

Photo.prototype.insertTagsAndLink = function() {
    var photo = this;
    var tags = this.tags
    var queries = [];
    for (tag in tags) {
        db.query("INSERT INTO tags (tag) VALUES (?)", {replacements: [tags[tag]]})
        queries.push({string: "INSERT INTO has_tag (photo_id, tag) VALUES (?, ?)", rep: {replacements: [this.photo_id, tags[tag]]}})
    }
    var query = db.chain(queries);
    query
        .run()
        .success(function() {
            return;
        })
        .error(function(err) {
            console.log(err);
        });
}

Photo.getPhotoByAlbum = function(album_id) {
    var query = db.query("SELECT photo_id, caption, path FROM photos WHERE album_id = ? ORDER BY photo_id", {replacements: [album_id]});
    return query;
}

Photo.getPath = function(id) {
    var response = db.query("SELECT path from photos where photo_id = ?", {replacements:[id]});
    return response;
}

Photo.getTags = function(id) {
    var response = db.query("SELECT tag from has_tag where photo_id = ?", {replacements:[id]});
    return response;
}

Photo.getRecent = function() {
    var response = db.query("SELECT photo_id, caption, path, album_id FROM photos ORDER BY photo_id LIMIT 5", {});
    return response;
}

module.exports = Photo;
