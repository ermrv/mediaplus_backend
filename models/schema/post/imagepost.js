const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const mongoosastic = require('mongoosastic')


var data = new Schema({
    mimetype: {
        type: String,
        enum: ['image/jpeg', 'image/png', 'image/jpg']
    },
    path: String,
    size: Number,
    hash: String,
    thumbnail: {
        type: String,
        default: "/thumbnail/default_thumb.jpeg"
    }
})


const ImagePostSchema = new mongoose.Schema({

    postContent: [data],
    aspectRatio: String,
    templateType: String,
    location: String,

    postBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    oldDescription: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    mentions: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    hashtags: [String],

}, {
    timestamps: true
})



//controller functions
ImagePostSchema.statics.createImagePost = async function (description, mentions, aspectRatio, templateType, location, req) {
    try {

        var fileDetails = [];
        //do file operation in each
        for (var f of req.files) {
            var e = {};
            e.mimetype = f.mimetype
            e.path = "/posts/".concat(f.filename)
            e.size = f.size
            fileDetails.push(e);
        }

        postData = {
            postContent: fileDetails,
            aspectRatio: aspectRatio,
            templateType: templateType,
            location: location,
            postBy: req.userData.userId,
            description: description,
            mentions: mentions
        }
        if (description) {
            postData.hashtags = description.match(/#[a-z]+/gi)
        }

        newImagePost = await this.create(postData)

        return newImagePost;
    } catch (error) {
        throw error;
    }
}




ImagePostSchema.plugin(mongoosastic, {
    'host': "localhost",
    'port': 9200
})





var ImagePost = mongoose.model('ImagePost', ImagePostSchema)


ImagePost.createMapping({
}, (err, mapping) => {
    if (err) {
        console.log('error creating mapping (you can safely ignore this)');
        console.log(err);
    } else {
        console.log('mapping created!');
        // console.log(mapping);
    }
});

ImagePost.syncIndexes()

module.exports = ImagePost;