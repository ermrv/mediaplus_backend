const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PostViewSchema = new mongoose.Schema({
    shortVideos: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    allPosts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],

}, { timestamps: true })

var PostView = mongoose.model('PostView', PostViewSchema)
module.exports = PostView;
