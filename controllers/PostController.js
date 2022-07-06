const postSchema = require('../models/Post');
const userSchema = require("../models/User");
const postImageSchema = require("../models/PostImage");


// Create and Save a new Post
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Post
    const post = {
        title: req.body.title,
        type: req.body.type,
        status: req.body.status ? req.body.status : false,
        description: req.body.description,
        user_id: req.body.user_id,
    };

    // Save Post in the database
    postSchema.create(post)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Post."
            });
        });
};

// Retrieve all Posts from the database.
exports.allPosts = (req, res) => {
    postSchema.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving posts."
            });
        });
};

// Update Post
exports.updatePost = async (req, res, next) => {
    await postSchema.updateOne(
        {_id: req.params.id},
        { $set: req.body, }
    );
    //
    postSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                data: data,
                message: 'Post successfully updated!',
            })
        }
    });
};


// Delete Post
exports.deletePost = async (req, res, next) => {
    //
    await postImageSchema.deleteOne({post_id: req.params.id});
    //
    postSchema.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                data: data,
                message: 'Post deleted successfully',
            })
        }
    });
};