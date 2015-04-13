var express = require('express');
var comments = express.Router();
var cc = require('../controllers/CommentCtrl');

/* Get all of the comments on a photo */
comments.get('/:photo_id', function(req, res) {
    var photo = req.params.photo_id;
    cc.getComments(photo, function(err, comments) {
        if (!err){
            res.json(comments);
        } else {
            res.json(err);
        }
    });
});

/* Get all of the users who liked a photo */
comments.get('/:photo_id/like', function(req, res) {
    var photo = req.params.photo_id;
    cc.getLikes(photo, function(err, likes) {
        if (!err){
            res.json(likes);
        } else {
            res.json(err);
        }
    });
});

/* Post a comment */
comments.post('/:photo_id', function(req, res) {
    var photo = req.params.photo_id;
    var user = req.query.uid;
    cc.addComment(photo, user, function(err, response) {
        if(!err) {
            res.json(response);
        } else {
            res.json(err);
        }
    });
});

/* Like a photo */
comments.post('/:photo_id/like', function(req, res) {
    var photo = req.params.photo_id;
    var user = req.query.uid;
    cc.addLike(photo, user, function(err, response) {
        if(!err) {
            res.json(response);
        } else {
            res.json(err);
        }
    });
});
