//....................ALL Imports.......................
const db = require('../../../database/models');


//....................ALL ImagePost Routes.......................   


exports.addNewPost = async (req, res) => {
  try {
    const { postLocation, location, description, mentions,  aspectRatio, templateType,commentOption, sharingOption } = req.body
    const postContentType = "image"
    if (req.files.length > 0 && req.files.length < 16) {
      const imagePost = await db.imagepost.createImagePost(description, mentions, aspectRatio, templateType, location, req)

      // for shared
      const primary = true
      const sharedDescription = null

      var response = await db.post.createNewPost(postContentType, primary, sharedDescription, mentions, imagePost._id, req.userData.userId, postLocation, imagePost.hashtags,commentOption, sharingOption)

      res.status(200).json(response)

    }
    else {
      res.status(400).json({
        noOfImages: req.files.length,
        error: "No of images should be 1 to 15 only."
      })
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

