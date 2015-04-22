var db = require('../controllers/dbConnector');

function Photo(photoInfo) {
    this.album_id = photoInfo.album_id;
    this.caption = photoInfo.caption;
    this.path = photoInfo.path;
    this.tags = photoInfo.tags;
    this.photo_id = photoInfo.photo_id;
}

Photo.prototype.create = function(next) {
    var photo = this;
    var insert = db.query("INSERT INTO photos (album_id, caption, path) VALUES (?, ?, ?)", {replacements: [this.album_id, this.caption, this.path], type: 'INSERT'});
    insert.then(function() {
        var query = db.query("SELECT photo_id FROM photos WHERE path = ?", {replacements: [photo.path]});
        query.then(function(id) {
            photo.photo_id = id[0][0].photo_id;
            next();
        })
    });
}


Photo.prototype.getId = function() {
    var photo = this;
    var response = db.query("SELECT photo_id from photos where path = ?", {replacements: [this.path]});
    response.then(function(id) {
        photo.photo_id = id[0][0]
    })
}

Photo.prototype.insertTagsAndLink = function() {
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

Photo.prototype.getTags = function(next) {
    var photo = this;
    var response = db.query("SELECT tag from has_tag where photo_id = ?", {replacements:[this.photo_id]});
    response.then( function(tags) {
        photo.tags = tags[0];
        next();
    })
}

Photo.prototype.getComments = function(next) {
    var photo = this;
    var response = db.query("SELECT comment FROM comments WHERE photo_id = ?", {replacements: [this.photo_id]});
    response.then(function(comments) {
        photo.comments = comments[0];
    })
}

Photo.getById = function(photo_id, callback) {
    var response = db.query("SELECT photo_id, caption, path, album_id FROM photos WHERE photo_id = ?", {replacements: [photo_id]});
    response.then(function(photo) {
        var p = new Photo(photo[0][0]);
        callback(p);
    }, function(err) {
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


Photo.getRecent = function() {
    var response = db.query("SELECT photo_id, caption, path, album_id FROM photos ORDER BY photo_id DESC LIMIT 5", {});
    return response;
}

module.exports = Photo;
