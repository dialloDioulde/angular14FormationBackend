const postImageSchema = require('../models/PostImage');
const multer = require("multer");
const mongoose = require("mongoose");
const postSchema = require("../models/Post");



// Multer File upload settings
const DIR = './public/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        console.log(file);
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        console.log(fileName);
        cb(null, fileName)
    }
});

// Multer Mime Type Validation
exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});


// Post Images
exports.uploadPostImage = (req, res, next) => {
    //
    const url = req.protocol + '://' + req.get('host');
    const postImage = {
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        avatar: url + '/public/' + req.file.filename,
        post_id: req.body.post_id
    };
    postImageSchema.create(postImage)
        .then(data => {
            console.log(data);
            res.status(201).json({
                message: "Posts image uploaded successfully",
                postImageUploaded: {
                    _id: data._id,
                    name: data.name,
                    avatar: data.avatar,
                    post_id: data.post_id
                }
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while uploading the Post Image."
            });
        });
};


// Retrieve all Image from the database.
exports.allImageOfPost = (req, res) => {
    postImageSchema.find()
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving posts image."
            });
        });
};


// Delete image of post
exports.deleteImageOfPost = (req, res, next) => {
    postImageSchema.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            let deleteStatus = { deleteStatus: false };
            return next(deleteStatus);
        } else {
            res.status(200).json({
                data: data,
                message: 'Post deleted successfully',
                deleteStatus: true,
            })
        }
    });
};

//
exports.deleteImageByField = async (req, res, next) => {
    let field = req.body.field;
    const result = await postImageSchema.deleteOne({field: req.params.id});
    if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
    } else {
        console.log("No documents matched the query. Deleted 0 documents.");
    }
}
