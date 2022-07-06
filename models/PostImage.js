const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let postImageSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    post_id: {
        type: Schema.Types.ObjectId, ref: 'Post'
    },
}, {
    collection: 'postImages'
})
module.exports = mongoose.model('PostImage', postImageSchema)
