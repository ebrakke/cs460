var express = require('express');
var photo = express.Router();

photo.post('/', function(req, res) {

})
photo.get('/:photo_id', function(req, res) {
    var photo = req.params.photo_id;
    pc.getPhoto(photo, function(err, response) {
        if(!err) {
            res.json(response);
        } else {
            res.json(err);
        }
    });
});

module.exports = photo;
