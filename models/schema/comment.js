const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subComment = new Schema({
  comment: {
    type: String,
    required: true,
  },
  commentBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  mentions: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  hashtags: [String],

}, {
  timestamps: true
});


const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  commentBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  mentions: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  hashtags: [String],
  subComments: [subComment],

}, {
  timestamps: true
})


//controller functions
CommentSchema.statics.createNewComment = async function (postId, comment, mentions, userId) {
  try {
    // create new comment 
    const commentData = {
      comment: comment,
      post: postId,
      commentBy: userId,
      mentions: mentions,
      hashtags: comment.match(/#[a-z]+/gi)
    }

    newComment = await this.create(commentData)

    return newComment;
  } catch (error) {
    throw error;
  }
}



CommentSchema.statics.editComment = async function (commentId, newComment, mentions, userId) {
  try {

    editComment = await this.findOneAndUpdate({
        _id: commentId,
        commentBy: userId
      }, {
        $set: {
          comment: newComment,
          mentions: mentions,
          hashtags: newComment.match(/#[a-z]+/gi)

        }
      }, {
        new: true
      })
      .populate('commentBy', 'username _id profilePic name')
      .populate('subComments.commentBy', 'username _id profilePic name')
      .populate('mentions', '_id name')
      .populate('subComments.mentions', '_id name')
    return editComment;
  } catch (error) {
    throw error;
  }
}

CommentSchema.statics.removeComment = async function (commentId, userId) {
  try {

    removeComment = await this.findOneAndRemove({
      _id: commentId,
      commentBy: userId
    }, {
      new: true
    })

    return removeComment;
  } catch (error) {
    throw error;
  }
}

CommentSchema.statics.commentDetail = async function (commentId) {
  try {
    commentDetail = await this.findById(commentId)
      .populate('commentBy', 'username _id profilePic name')
      .populate('mentions', '_id name')
      .populate('subComments.mentions', '_id name')
      .populate('subComments.commentBy', 'username _id profilePic name')

    return commentDetail

  } catch (error) {
    throw error;
  }
}

CommentSchema.statics.allComments = async function (postId) {
  try {
    postComments = await this.find({
        post: postId
      })
      .populate('commentBy', 'username _id profilePic name')
      .populate('mentions', '_id name')
      .populate('subComments.mentions', '_id name')
      .populate('subComments.commentBy', 'username _id profilePic name')

    return postComments

  } catch (error) {
    throw error;
  }
}

CommentSchema.statics.createSubComment = async function (commentId, subComment, mentions, userId) {
  try {

    const newSubComment = {
      comment: subComment,
      commentBy: userId,
      mentions: mentions,
      hashtags: subComment.match(/#[a-z]+/gi)

    }
    const addSubComment = await this.findOneAndUpdate({
        _id: commentId
      }, {
        $push: {
          subComments: newSubComment
        }
      }, {
        new: true
      })
      .populate('commentBy', 'username _id profilePic name')
      .populate('subComments.commentBy', 'username _id profilePic name')
      .populate('mentions', '_id name')
      .populate('subComments.mentions', '_id name')

    return addSubComment;
  } catch (error) {
    throw error;
  }
}

CommentSchema.statics.editSubComment = async function (commentId, subCommentId, newSubComment, mentions, userId) {
  try {
    editSubComment = await this.findOneAndUpdate({
        _id: commentId,
        'subComments._id': subCommentId,
        'subComments.commentBy': userId
      }, {
        $set: {
          'subComments.$.comment': newSubComment,
          'subComments.$.mentions': mentions,
          'subComments.$.hashtags': neSubComment.match(/#[a-z]+/gi)

        }
      }, {
        new: true
      })
      .populate('commentBy', 'username _id profilePic name')
      .populate('subComments.commentBy', 'username _id profilePic name')
      .populate('mentions', '_id name')
      .populate('subComments.mentions', '_id name')
    return editSubComment;
  } catch (error) {
    throw error;
  }
}

CommentSchema.statics.removeSubComment = async function (commentId, subCommentId, userId) {
  try {
    removesubComment = await this.findOneAndUpdate({
        _id: commentId,
        'subComments.commentBy': userId
      }, {
        $pull: {
          subComments: {
            _id: subCommentId
          }
        }
      }, {
        new: true
      })
      .populate('commentBy', 'username _id profilePic name')
      .populate('subComments.commentBy', 'username _id profilePic name')
      .populate('mentions', '_id name')
      .populate('subComments.mentions', '_id name')
    return removesubComment;
  } catch (error) {
    return error;
  }
}


var Comment = mongoose.model('Comment', CommentSchema)
module.exports = Comment;