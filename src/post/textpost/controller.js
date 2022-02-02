//....................ALL Imports.......................
const db = require('../../../models');


//....................ALL TextPost Routes.......................   


exports.addNewPost = async (req, res) => {
  try {

    const { postLocation, description, mentions, commentOption, sharingOption } = req.body
    const postContentType = "text"
    if(!description){
      res.status(400).json({ error: "Post is missing.!"})
    }
    else{
      const textPost = await db.textpost.createTextPost(description, mentions, req.userData.userId)

      // for shared
      const primary = true
      const sharedDescription = null

      var response = await db.post.createNewPost(postContentType, primary, sharedDescription, mentions,   textPost._id, req.userData.userId, postLocation, textPost.hashtags, commentOption, sharingOption)

      res.status(200).json(response)
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
