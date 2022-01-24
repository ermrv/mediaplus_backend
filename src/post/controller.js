//....................ALL Imports.......................
const db = require('../../models');
var _ = require('lodash');


//....................ALL Post Page Routes.......................
exports.userPosts = async (req, res) => {
  try {
    const { type, dataType, postId } = req.body

    var result = await db.user.userPosts(req.userData.userId)
    response = []

    postIds = []
    for (let i = 0; i < result.length; i++) {
      postIds.push(String(result[i]._id))
    }
    postIds = postIds.reverse()

    if (dataType == "latest" && postIds.includes(postId)) {
      postIndex = postIds.indexOf(postId)
      result = result.slice(postIndex + 1, postIndex + 11)
      if (type == "text") {
        for (let i = 0; i < result.length; i++) {
          if (result[i].postContentType == "text") {
            response.push(result[i])
          }
        }

        res.status(200).json(response)

      } else if (type == "image") {

        for (let i = 0; i < result.length; i++) {
          if (result[i].postContentType == "image") {
            response.push(result[i])
          }
        }

        res.status(200).json(response)

      } else if (type == "video") {

        for (let i = 0; i < result.length; i++) {
          if (result[i].postContentType == "video") {
            response.push(result[i])
          }
        }

        res.status(200).json(response.slice(0, 20))

      } else {
        response = result
        res.status(200).json(response.slice(0, 20))
      }


    }
    else if (dataType == "previous" && postIds.includes(postId)) {
      postIndex = postIds.indexOf(postId)
      result = result.slice(0, postIndex)
      response = result
      res.status(200).json(response)
    }
    else {

      if (type == "text") {
        for (let i = 0; i < result.length; i++) {
          if (result[i].postContentType == "text") {
            response.push(result[i])
          }
        }
        res.status(200).json(response.slice(0, 10))

      } else if (type == "image") {

        for (let i = 0; i < result.length; i++) {
          if (result[i].postContentType == "image") {
            response.push(result[i])
          }
        }
        res.status(200).json(response.slice(0, 10))

      } else if (type == "video") {
        for (let i = 0; i < result.length; i++) {
          if (result[i].postContentType == "video") {
            response.push(result[i])
          }
        }

        res.status(200).json(response.slice(0, 10))

      } else {
        response = result
        res.status(200).json(response.slice(0, 10))
      }

    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.otherUserPosts = async (req, res) => {
  try {

    const { type, userId, dataType, postId } = req.body
    var result = await db.user.userPosts(userId)
    response = []

    postIds = []
    for (let i = 0; i < result.length; i++) {
      postIds.push(String(result[i]._id))
    }
    postIds = postIds.reverse()

    if (dataType == "latest" && postIds.includes(postId)) {
      postIndex = postIds.indexOf(postId)
      result = result.slice(postIndex + 1, postIndex + 21)
      if (type == "text") {
        for (let i = 0; i < result.length; i++) {
          if (result[i].postContentType == "text") {
            response.push(result[i])
          }
        }

        res.status(200).json(response)

      } else if (type == "image") {

        for (let i = 0; i < result.length; i++) {
          if (result[i].postContentType == "image") {
            response.push(result[i])
          }
        }

        res.status(200).json(response)

      } else if (type == "video") {

        for (let i = 0; i < result.length; i++) {
          if (result[i].postContentType == "video") {
            response.push(result[i])
          }
        }

        res.status(200).json(response.slice(0, 20))

      } else {
        response = result
        res.status(200).json(response.slice(0, 20))
      }


    }
    else if (dataType == "previous" && postIds.includes(postId)) {
      postIndex = postIds.indexOf(postId)
      result = result.slice(0, postIndex)
      response = result
      res.status(200).json(response)
    } else {

      if (type == "text") {
        for (let i = 0; i < result.length; i++) {
          if (result[i].postContentType == "text") {
            response.push(result[i])
          }
        }
        res.status(200).json(response.slice(0, 10))

      } else if (type == "image") {

        for (let i = 0; i < result.length; i++) {
          if (result[i].postContentType == "image") {
            response.push(result[i])
          }
        }
        res.status(200).json(response.slice(0, 10))

      } else if (type == "video") {
        for (let i = 0; i < result.length; i++) {
          if (result[i].postContentType == "video") {
            response.push(result[i])
          }
        }

        res.status(200).json(response.slice(0, 10))

      } else {
        response = result
        res.status(200).json(response.slice(0, 10))
      }

    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.postDetail = async (req, res) => {
  try {
    const response = await db.post.postDetail(req.body.postId)

    //for log
    reactType = "visit"
    createLog = await db.userlog.createLog(req.userData.userId, response._id, reactType)

    res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

//not modeified
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.body
    deleteFromPost = await db.post.deleteOne({ _id: postId, postBy: req.userData.userId })
    removeFromUser = await db.user.updateOne({ _id: req.userData.userId }, {
      $pull: {
        posts: postId
      }
    })
    removeFromSelfNewsfeed = await db.content.updateOne({
      userId: req.userData.userId,
      'boxes.viewType': "userPosts"
    }, {
      $pull: {
        'boxes.$.boxContents.contents': postId
      }
    })

    if (deleteFromPost.deletedCount && removeFromUser.nModified && removeFromSelfNewsfeed.nModified) {
      res.status(200).json({
        postDeleted: "true",
        message: "post deleted"
      })
    } else {
      res.status(400).json({
        postDeleted: "false",
        message: "Something went wrong"
      })
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.editPost = async (req, res) => {
  try {
    const { postId, description } = req.body
    if (!postId || !description) {
      res.status(400).json({ error: "PostId and description are required.!" })
    } else {

      postData = await db.post.findById({ _id: postId })

      postType = postData.postContentType

      updateItems = {
        description: description,
        hashtags: description.match(/#[a-z]+/gi)
      }

      if (postType == 'text') {
        updatePost = await db.textpost.findOneAndUpdate({ _id: postData.textPost, postBy: req.userData.userId }, updateItems, { new: true })
          .populate({
            path: 'postBy',
            select: 'username _id profilePic name',
          })
      }
      else if (postType == 'image') {
        updatePost = await db.imagepost.findOneAndUpdate({ _id: postData.imagePost, postBy: req.userData.userId }, updateItems, { new: true })
          .populate({
            path: 'postBy',
            select: 'username _id profilePic name',
          })
      }
      else if (postType == 'video') {
        updatePost = await db.videopost.findOneAndUpdate({ _id: postData.videoPost, postBy: req.userData.userId }, updateItems, { new: true })
          .populate({
            path: 'postBy',
            select: 'username _id profilePic name',
          })
      }
      else if (postType == 'contest') {
        updatePost = await db.contest.findOneAndUpdate({ _id: postData.contestPost, contestBy: req.userData.userId }, updateItems, { new: true })
          .populate({
            path: 'contestBy',
            select: 'username _id profilePic name',
          })
      }
      else if (postType == 'poll') {
        updatePost = await db.pollpost.findOneAndUpdate({ _id: postData.pollPost, postBy: req.userData.userId }, updateItems, { new: true })
          .populate({
            path: 'postBy',
            select: 'username _id profilePic name',
          })
      }
      else if (postType == 'event') {
        updatePost = await db.eventpost.findOneAndUpdate({ _id: postData.eventPost, postBy: req.userData.userId }, updateItems, { new: true })
          .populate({
            path: 'postBy',
            select: 'username _id profilePic name',
          })
      } else {
        console.log("post edit api error")
        updatePost = "error"
      }
      if (updatePost) {
        res.status(200).json({
          postEdited: true,
          updatePost
        })
      } else {
        res.status(400).json({
          postEdited: false,
          error: "you are not authorised.!"
        })
      }

    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.postReaction = async (req, res) => {
  try {
    const { postId, like } = req.body
    if (!postId) {
      res.status(400).json({ error: "Enter required fields.!" })
    } else {
      if (like) {
        addReaction = await db.post.findOneAndUpdate({ _id: postId }, { $addToSet: { likes: req.userData.userId } }, { new: true })

        //for log
        reactType = "like"
        createLog = await db.userlog.createLog(req.userData.userId, postId, reactType)
        // for notification
        notificationType = "like"
        var followed, commentId;
        createNotification = await db.notification.createNotification(req.userData.userId, notificationType, followed, postId, commentId)

        res.status(200).json(addReaction.likes)
      }
      else {
        addReaction = await db.post.findOneAndUpdate({ _id: postId }, { $pull: { likes: req.userData.userId } }, { new: true })
        res.status(200).json(addReaction.likes)
      }
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });

  }

}

exports.reactedUsers = async (req, res) => {
  try {
    const { postId } = req.body

    post = await db.post.findOne({ _id: postId }, 'likes')
      .populate({
        path: 'likes',
        select: 'username _id profilePic name',
      })

    res.status(200).json(post.likes)

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

}

exports.sharePost = async (req, res) => {
  try {
    const { sharedDescription, mentions,  postId, postLocation } = req.body
    if (!postId) {
      res.status(400).json({ error: "postId is missing" })
    } else {

      postData = await db.post.findById(postId)
      if (postData) {

        const postContentType = postData.postContentType
        const primary = false
        response = await db.post.sharePost(postContentType, primary, sharedDescription, mentions,  postId, req.userData.userId, postLocation)

        //for log
        reactType = "share"
        createLog = await db.userlog.createLog(req.userData.userId, response._id, reactType)

        // for notification
        notificationType = "share"
        var followed, commentId;
        createNotification = await db.notification.createNotification(req.userData.userId, notificationType, followed, response._id, commentId)

        // return shared post id to original post 
        
        res.status(200).json(response)
      } else {
        res.status(404).json({ error: "postId doesn't exist.!" })
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.sharedPostDetails = async (req, res) => {
  try {
    const { postId } = req.body
    if (!postId) {
      res.status(400).json({ error: "postId is missing" })
    } else {


      postData = await db.post.findById(postId)

      if (postData) {

        const type = postData.postContentType + "Post"

        const query = {
          primary: false,
          postContentType: postData.postContentType
        }
        query[type] = postId

        response = await db.post.find(query)
          .populate({
            path: 'postBy',
            select: 'username _id profilePic name',
          })

        res.status(200).json(response)


      } else {
        res.status(404).json({ error: "postId doesn't exist.!" })
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });

  }
}

exports.updatethumbnail = async (req, res) => {
  try {
    const postContentId = req.body.postContentId

    // const card = {
    //   thumbnail: "/thumbnail/" + req.file.filename
    // }

    // const response = await db.post.update({ _id: _id }, card)

    // if (response.ok == 1) {
    //   res.status(200).json({ message: "Data added" })
    // }
    // else {
    //   res.status(200).json({
    //     error: "Something went wrong.!"
    //   })
    // }

    res.status(400).json({
      error: "In Maintainance..!!"
    })

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
