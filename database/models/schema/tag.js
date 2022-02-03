const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const mongoosastic = require('mongoosastic')


const TagSchema = new mongoose.Schema({

  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post',
  }],
  hashtag: {
    type: String,
    unique: true,
    required: true
  },
  count: {
    type: Number,
    default: 1
  }

}, { timestamps: true })


TagSchema.statics.updateTags = async function (hashtags, postId) {
  try {
    if (hashtags) {
      for (let i = 0; i < hashtags.length; i++) {
        tag = await this.findOne({ hashtag: hashtags[i].toLowerCase() })
        if (tag) {
          // update existing ( add post id and increase count)
          updateTag = await this.findByIdAndUpdate({ _id: tag._id }, { $inc: { 'count': 1 }, $addToSet: { posts: postId } })
        } else {
          // create new
          hashtagData = {
            posts: postId,
            hashtag: hashtags[i].toLowerCase(),
            count: 1
          }
          createNew = this.create(hashtagData)
        }
      }
      return tag;
    }

  } catch (error) {
    throw error;
  }
}


TagSchema.plugin(mongoosastic, {
  'host': "localhost",
  'port': 9200
})

var Tag = mongoose.model('Tag', TagSchema)

Tag.createMapping({
}, (err, mapping) => {
  if (err) {
    console.log('error creating mapping (you can safely ignore this)');
    console.log(err);
  } else {
    console.log('mapping created!');
  }
});

Tag.syncIndexes()
module.exports = Tag;