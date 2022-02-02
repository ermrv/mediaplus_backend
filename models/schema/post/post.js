const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const mongoosastic = require('mongoosastic')


const PostSchema = new mongoose.Schema({
  promoted: {
    type: Boolean,
    default: false
  },
  redirectTo: {
    type: String,
    enum: ['link', 'profile'],
    default: 'link'
  },
  redirection: {
    type: String,
  },
  shares: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  mentions: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  commentOption:String,
  sharingOption:String,
  postContentType: {
    type: String,
    enum: ["image", "poll", "event", "contest", "video", 'text'],
    required: true
  },
  primary: {
    type: String,
    default: true  // original post not shared by user 
  },
  //types of posts
  textPost: {
    type: Schema.Types.ObjectId,
    ref: 'TextPost'
  },
  imagePost: {
    type: Schema.Types.ObjectId,
    ref: 'ImagePost'
  },
  videoPost: {
    type: Schema.Types.ObjectId,
    ref: 'VideoPost'
  },
  pollPost: {
    type: Schema.Types.ObjectId,
    ref: 'PollPost'
  },
  // eventPost: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Event'
  // },
  // contestPost: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Contest'
  //},

  //general and common things
  sharedDescription: {
    type: String,
    trim: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  postBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // postLink: {
  //     type: String,
  //     default: "https://mediaplus.com"
  // },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  postLocation: {
    type: String,
  },
  hashtags: [String],

  // // do it automatically 
  // noOfComments: {
  //     type: Number,
  //     default: '0',
  // },
  // noOfLikes: {
  //     type: Number,
  //     default: '0',
  // },

  //similar items 
  similarPosts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],

  //creation format 
  postCreated: Number,

}, { timestamps: true })

PostSchema.set('toObject', { virtuals: true })
PostSchema.set('toJSON', { virtuals: true })

//controller functions

PostSchema.virtual('noOfComments').get(function () {
  return this.comments.length
});

PostSchema.virtual('noOfLikes').get(function () {
  return this.likes.length
});

PostSchema.virtual('noOfShares').get(function () {
  return this.shares.length
})

PostSchema.virtual('postLink').get(function () {
  const link = "https://mediaplus.com/posts/" + this._id
  return link
})

PostSchema.statics.postDetail = async function (postId) {
  try {
    data = await this.findById(postId)
      .populate('postBy', 'username _id profilePic name')
      .populate('mentions', '_id name')
      .populate({
        path: 'textPost',
        populate: {
          path: 'postBy',
          select: 'username _id profilePic name'
        }
      })
      .populate({
        path: 'imagePost',
        populate: {
          path: 'postBy',
          select: 'username _id profilePic name'
        }
      })
      .populate({
        path: 'videoPost',
        populate: {
          path: 'postBy',
          select: 'username _id profilePic name'
        }
      })
      .populate({
        path: 'contestPost',
        populate: {
          path: 'contestBy',
          select: 'username _id profilePic name'
        }
      })
      .populate({
        path: 'pollPost',
        populate: {
          path: 'postBy',
          select: 'username _id profilePic name'
        }
      })
      .populate({
        path: 'eventPost',
        populate: {
          path: 'postBy',
          select: 'username _id profilePic name'
        }
      })
      .populate({
        path: 'textPost',
        populate: {
          path: 'mentions',
          select: '_id name'
        }
      })
      .populate({
        path: 'imagePost',
        populate: {
          path: 'mentions',
          select: '_id name'
        }
      })
      .populate({
        path: 'videoPost',
        populate: {
          path: 'mentions',
          select: '_id name'
        }
      })
      .populate({
        path: 'contestPost',
        populate: {
          path: 'mentions',
          select: '_id name'
        }
      })
      .populate({
        path: 'pollPost',
        populate: {
          path: 'mentions',
          select: '_id name'
        }
      })
      .populate({
        path: 'eventPost',
        populate: {
          path: 'mentions',
          select: '_id name'
        }
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'commentBy',
          select: 'username _id profilePic name'
        }
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'subComments',
          populate: {
            path: 'commentBy',
            select: 'username _id profilePic name'
          }
        }
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'mentions',
          select: '_id name'
        }
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'subComments',
          populate: {
            path: 'mentions',
            select: '_id name'
          }
        }
      })

    return data;
  } catch (error) {
    throw error;
  }
}

PostSchema.statics.arrayPostDetail = async function (postIds) {
  try {

    data = await this.find({ _id: { $in: postIds } })
      .populate('postBy', 'username _id profilePic name')
      .populate('mentions', '_id name')
      .populate({
        path: 'comments',
        options: { limit: 1 },
        populate: {
          path: 'commentBy',
          select: 'username _id profilePic name'
        }
      })
      .populate('subComments.commentBy', 'username _id profilePic name')
      .populate({
        path: 'textPost',
        populate: {
          path: 'postBy',
          select: 'username _id profilePic name'
        }
      })
      .populate({
        path: 'imagePost',
        populate: {
          path: 'postBy',
          select: 'username _id profilePic name'
        }
      })
      .populate({
        path: 'videoPost',
        populate: {
          path: 'postBy',
          select: 'username _id profilePic name'
        }
      })
      .populate({
        path: 'contestPost',
        populate: {
          path: 'contestBy',
          select: 'username _id profilePic name'
        }
      })
      .populate({
        path: 'pollPost',
        populate: {
          path: 'postBy',
          select: 'username _id profilePic name'
        }
      })
      .populate({
        path: 'eventPost',
        populate: {
          path: 'postBy',
          select: 'username _id profilePic name'
        }
      })
      .populate({
        path: 'textPost',
        populate: {
          path: 'mentions',
          select: '_id name'
        }
      })
      .populate({
        path: 'imagePost',
        populate: {
          path: 'mentions',
          select: '_id name'
        }
      })
      .populate({
        path: 'videoPost',
        populate: {
          path: 'mentions',
          select: '_id name'
        }
      })
      .populate({
        path: 'contestPost',
        populate: {
          path: 'mentions',
          select: '_id name'
        }
      })
      .populate({
        path: 'pollPost',
        populate: {
          path: 'mentions',
          select: '_id name'
        }
      })
      .populate({
        path: 'eventPost',
        populate: {
          path: 'mentions',
          select: '_id name'
        }
      })
    return data.reverse();
  } catch (error) {
    throw error;
  }
}

PostSchema.statics.distributePosts = async function (userId, postId) {
  try {
    // add to user posts
    var User = require('./../user')
    userData = await User.addPostToUser(userId, postId)

    // add to newsfeeds
    addToNewsfeed = await User.addToNewsFeeds(userId, postId)

    // add to total post collection (explore)
    var Postview = require('./../postview')
    allPosts = await Postview.updateOne({ _id: "613b26eae8548fc8339af207" }, { $addToSet: { allPosts: postId } })

  } catch (error) {
    throw error
  }
}

// to reverify after post add api
PostSchema.statics.createNewPost = async function (postContentType, primary, sharedDescription, mentions, postId, userId, postLocation, hashtags,commentOption, sharingOption) {
  try {
    if (!postContentType || !postId || !userId) {
      return "Enter required fields."
    } else {
      const type = postContentType + "Post"

      const newPost = {
        postContentType: postContentType,
        primary: primary,
        postBy: userId,
        hashtags: hashtags,
        postLocation: postLocation,
        sharedDescription: sharedDescription,
        mentions: mentions,
        commentOption:commentOption,
        sharingOption:sharingOption,
        postCreated: Date.now(),
      }
      newPost[type] = postId

      postData = await this.findOneAndUpdate({ _id: postId }, { $set: newPost }, { new: true, upsert: true })
      data = await this.postDetail(postData._id)

      // send to post distributor( controls where post will be shown)
      await this.distributePosts(userId, data._id)

      // update tags
      if (data.hashtags) {
        var Tag = require('./../tag')
        update = await Tag.updateTags(data.hashtags, data._id)
      }

      return data;
    }
  } catch (error) {
    throw error;
  }
}

PostSchema.statics.sharePost = async function (postContentType, primary, sharedDescription, mentions,  postId, userId, postLocation) {
  try {
    if (!postContentType || !postId || !userId) {
      return "Enter required fields."
    } else {
      const type = postContentType + "Post"

      const newPost = {
        postContentType: postContentType,
        primary: primary,
        postBy: userId,
        postLocation: postLocation,
        sharedDescription: sharedDescription,
        mentions: mentions,
        postCreated: Date.now()
      }
      if (sharedDescription) {
        newPost.hashtags = sharedDescription.match(/#[a-z]+/gi)
      }
      newPost[type] = postId

      postData = await this.create(newPost)
      data = await this.postDetail(postData._id)

      // send to post distributor( controls where post will be shown)
      await this.distributePosts(userId, data._id)

      // update tags
      var Tag = require('./../tag')
      update = await Tag.updateTags(data.hashtags, data._id)

      // increase no of share to original post (add shared post id to original post )


      return data;
    }
  } catch (error) {
    throw error;
  }
}

PostSchema.statics.deletePost = async function (postId) {
  try {
    data = await this.findOneAndDelete({ _id: postId })
    return data;
  } catch (error) {
    throw error;
  }
}

PostSchema.plugin(mongoosastic, {
  'host': "localhost",
  'port': 9200
})


var Post = mongoose.model('Post', PostSchema)

Post.createMapping({
}, (err, mapping) => {
  if (err) {
    console.log('error creating mapping (you can safely ignore this)');
    console.log(err);
  } else {
    console.log('mapping created!');
    // console.log(mapping);
  }
});

Post.syncIndexes()
module.exports = Post;

