const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let postSchema = new Schema({
    title: {
        type: String
    },
    type: {
        type: String
    },
    status: {
        type: Boolean
    },
    description: {
        type: String,
    },
    user_id: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
}, {
    collection: 'posts'
})

module.exports = mongoose.model('Post', postSchema)