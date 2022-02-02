//....................ALL Imports.......................
const db = require('../../../models');


//....................ALL VideoPost Routes.......................   

exports.addNewPost = async (req, res) => {
  try {
    const { postLocation, location, description, mentions, aspectRatio, templateType, commentOption, sharingOption } = req.body
    const postContentType = "video"
    if (req.files.length == 1) {
      const videoPost = await db.videopost.createVideoPost(description, mentions, aspectRatio, templateType, location, req)

      // for shared
      const primary = true
      const sharedDescription = null

      var response = await db.post.createNewPost(postContentType, primary, sharedDescription, mentions, videoPost._id, req.userData.userId, postLocation, videoPost.hashtags, commentOption, sharingOption)

      //..................................................................
      // update to short videos
      if (response.videoPost.shortVideo) {
        await db.postview.findByIdAndUpdate({ _id: "613b26eae8548fc8339af207" }, { $addToSet: { shortVideos: response._id } })
      }

      res.status(200).json(response)

    }
    else {
      console.log(req.files)
      res.status(400).json({
        noOfVideos: req.files.length,
        error: "No of videos should be exact 1 only."
      })
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

