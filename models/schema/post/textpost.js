const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const mongoosastic = require('mongoosastic')


const TextPostSchema = new mongoose.Schema({

    postBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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
TextPostSchema.statics.createTextPost = async function (description, mentions, userId) {
    try {

        postData = {
            postBy: userId,
            description: description,
            mentions: mentions
        }
        if (description) {
            postData.hashtags = description.match(/#[a-z]+/gi)
        }

        newTextPost = await this.create(postData)
        return newTextPost;
    } catch (error) {
        throw error;
    }
}

TextPostSchema.plugin(mongoosastic, {
    'host': "localhost",
    'port': 9200
})


var TextPost = mongoose.model('TextPost', TextPostSchema)

TextPost.createMapping({
}, (err, mapping) => {
    if (err) {
        console.log('error creating mapping (you can safely ignore this)');
        console.log(err);
    } else {
        console.log('mapping created!');
    }
});

TextPost.syncIndexes()
module.exports = TextPost;