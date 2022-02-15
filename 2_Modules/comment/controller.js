//....................ALL Imports.......................
const db = require('./../../3_SystemKernel/database/models');
var _ = require('lodash');

//....................ALL Comment Page Routes.......................
// Post comments apis

// Comment
exports.addPostComment = async (req, res) => {
  try {
    const { postId, comment, mentions } = req.body
    if (!postId || !comment) {
      res.status(400).json({ error: "PostId or comment missing.!" })
    }
    else {

      createComment = await db.comment.createNewComment(postId, comment, mentions, req.userData.userId)
      addToPost = await db.post.updateOne({ _id: postId },
        {
          $addToSet: { comments: createComment._id },
        }, { new: true })

      addToUser = await db.user.updateOne({ _id: req.userData.userId }, { $addToSet: { comments: postId } })

      commentData = await db.comment.commentDetail(createComment._id)

      //for log
      reactType = "comment"
      createLog = await db.userlog.createLog(req.userData.userId, postId, reactType)
      res.status(200).json(commentData)

      // for notification
      // to the owner of the post and ( toDo: subscribed to specific group-- who commented on same)
      notificationType = "comment"
      var followed;
      createNotification = await db.notification.createNotification(req.userData.userId, notificationType, followed, postId, createComment._id)
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.editPostComment = async (req, res) => {
  try {
    const { commentId, newComment, mentions } = req.body
    if (!commentId || !newComment) {
      res.status(400).json({ error: "PostId or comment missing.!" })
    }
    else {
      editComment = await db.comment.editComment(commentId, newComment, mentions, req.userData.userId)
      res.status(200).json(editComment)
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.removePostComment = async (req, res) => {
  try {

    const { commentId } = req.body
    if (!commentId) {
      res.status(400).json({ error: "postId is missing or incorrect" })
    } else {

      // remove from comment
      deleteComment = await db.comment.removeComment(commentId, req.userData.userId)
      //remove from user
      removeFromUser = await db.user.updateOne({ _id: req.userData.userId }, { $pull: { comments: commentId } })
      res.status(200).json({ message: "comment removed." })

    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.allPostComments = async (req, res) => {
  try {
    const { postId } = req.body
    if (!postId) {
      res.status(400).json({ error: "postId is missing or incorrect" })
    } else {

      //fetching data
      postComments = await db.comment.allComments(postId)

      res.status(200).json(postComments)
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// SubComment
exports.addPostSubComment = async (req, res) => {
  try {
    const { commentId, subComment, mentions } = req.body
    if (!commentId || !subComment) {
      res.status(400).json({ error: "CommentId or SubComment missing.!" })
    }
    else {
      const addSubComment = await db.comment.createSubComment(commentId, subComment, mentions, req.userData.userId)

      //for log
      reactType = "comment"
      createLog = await db.userlog.createLog(req.userData.userId, addSubComment.post, reactType)

      // for notification
      notificationType = "comment"
      var followed;
      createNotification = await db.notification.createNotification(req.userData.userId, notificationType, followed, addSubComment.postId, commentId)

      res.status(200).json(addSubComment)
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.editPostSubComment = async (req, res) => {
  try {
    const { commentId, subCommentId, newSubComment, mentions } = req.body
    if (!commentId || !subCommentId || !newSubComment) {
      res.status(400).json({ error: "commentId, subCommentId or newSubComment missing.!" })
    } else {
      editSubComment = await db.comment.editSubComment(commentId, subCommentId, newSubComment, mentions, req.userData.userId)
      res.status(200).json(editSubComment)
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.removePostSubComment = async (req, res) => {
  try {
    const { commentId, subCommentId } = req.body
    removesubComment = await db.comment.removesubComment(commentId, subCommentId, req.userData.userId)
    res.status(200).json(removesubComment)

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// // Status comments apis

// // Comment
// exports.addStatusComment = async (req, res) => {
//   try {
//     const { statusId, comment } = req.body
//     if (!statusId || !comment) {
//       res.status(400).json({ error: "statusId or comment missing.!" })
//     }
//     else {
//       createComment = await db.comment.createNewComment(statusId, comment, req.userData.userId)
//       commentData = await db.comment.findById(createComment._id)
//         .populate('commentBy', 'username _id profilePic name')
//       // .populate('subComments.commentBy', 'username _id profilePic name')         // not needed : since it is new comment

//       res.status(200).json(commentData)
//     }

//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }

// exports.editStatusComment = async (req, res) => {
//   try {
//     const { commentId, newComment } = req.body
//     if (!commentId || !newComment) {
//       res.status(400).json({ error: "commentId or newComment is missing.!" })
//     }
//     else {
//       editComment = await db.comment.editComment(commentId, newComment, req.userData.userId)
//       res.status(200).json(editComment)
//     }
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }

// exports.removeStatusComment = async (req, res) => {
//   try {

//     const { commentId } = req.body
//     if (!commentId) {
//       res.status(400).json({ error: "commentId is missing or incorrect" })
//     } else {

//       // remove from comment
//       deleteComment = await db.comment.removeComment(commentId, req.userData.userId)
//       //remove from user
//       removeFromUser = await db.user.updateOne({ _id: req.userData.userId }, { $pull: { comments: commentId } })
//       res.status(200).json({ message: "comment removed." })

//     }
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }

// exports.allStatusComments = async (req, res) => {
//   try {
//     const { statusId } = req.body
//     if (!statusId) {
//       res.status(400).json({ error: "statusId is missing or incorrect" })
//     } else {

//       //fetching data
//       postComments = await db.comment.allComments(statusId)

//       res.status(200).json(postComments)
//     }

//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }

// // SubComment
// exports.addStatusSubComment = async (req, res) => {
//   try {
//     const { commentId, subComment } = req.body
//     if (!commentId || !subComment) {
//       res.status(400).json({ error: "CommentId or SubComment missing.!" })
//     }
//     else {
//       const addSubComment = await db.comment.createSubComment(commentId, subComment, req.userData.userId)
//       res.status(200).json(addSubComment)
//     }
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }

// exports.editStatusSubComment = async (req, res) => {
//   try {
//     const { commentId, subCommentId, newSubComment } = req.body
//     if (!commentId || !subCommentId || !newSubComment) {
//       res.status(400).json({ error: "commentId, subCommentId or newSubComment missing.!" })
//     } else {
//       editSubComment = await db.comment.editSubComment(commentId, subCommentId, newSubComment, req.userData.userId)
//       res.status(200).json(editSubComment)
//     }
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }

// exports.removeStatusSubComment = async (req, res) => {
//   try {
//     const { commentId, subCommentId } = req.body
//     removesubComment = await db.comment.removesubComment(commentId, subCommentId, req.userData.userId)
//     res.status(200).json(removesubComment)

//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }



// reaction on comment and subcomment

exports.commentReaction = async (req, res) => {
  try {
    const { commentId, like } = req.body
    if (!commentId) {
      res.status(400).json({ error: "Enter required fields.!" })
    } else {
      if (like) {
        addReaction = await db.comment.findOneAndUpdate({ _id: commentId }, { $addToSet: { likes: req.userData.userId } }, { new: true })

        // for notification
        notificationType = "commentLike"
        var followed;
        createNotification = await db.notification.createNotification(req.userData.userId, notificationType, followed, addReaction.post, commentId)
        res.status(200).json(addReaction.likes)

      }
      else {
        addReaction = await db.comment.findOneAndUpdate({ _id: commentId }, { $pull: { likes: req.userData.userId } }, { new: true })
        res.status(200).json(addReaction.likes)
      }
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.commentReactedUsers = async (req, res) => {
  try {
    const { commentId } = req.body

    comment = await db.comment.findOne({ _id: commentId }, 'likes')
      .populate({
        path: 'likes',
        select: 'username _id profilePic name',
      })

    res.status(200).json(comment.likes)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.subCommentReaction = async (req, res) => {
  try {

    const { commentId, subCommentId, like } = req.body
    if (!commentId || !subCommentId) {
      res.status(400).json({ error: "Enter required fields.!" })
    } else {
      if (like) {
        addReaction = await db.comment.findOneAndUpdate({ _id: commentId, "subComments._id": subCommentId }, { $addToSet: { "subComments.$.likes": req.userData.userId } }, { new: true })
        // res.status(200).json(addReaction)
      }
      else {
        addReaction = await db.comment.findOneAndUpdate({ _id: commentId, "subComments._id": subCommentId }, { $pull: { "subComments.$.likes": req.userData.userId } }, { new: true })
        // res.status(200).json(addReaction)
      }
      response = await db.comment.findById({ _id: commentId }, {
        subComments: {
          "$elemMatch": {
            "_id": subCommentId
          }
        }
      })
      res.status(200).json(response.subComments[0].likes)
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.subCommentReactedUsers = async (req, res) => {
  try {
    const { commentId, subCommentId } = req.body

    response = await db.comment.findById({ _id: commentId }, {
      subComments: {
        "$elemMatch": {
          "_id": subCommentId
        }
      }
    }).populate({
      path: 'subComments.likes',
      select: 'username _id profilePic name',
    })
    res.status(200).json(response.subComments[0].likes)

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

