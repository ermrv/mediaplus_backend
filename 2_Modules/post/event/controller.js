//....................ALL Imports.......................
const db = require('./../../../3_SystemKernel/database/models');
var _ = require('lodash');

//....................ALL Event Routes.......................   

exports.addNewPost = async (req, res) => {
  try {

    const { postLocation, eventName, description, mentions, startsOn, endsOn } = req.body
    const postContentType = "event"
    if(!description || !eventName ){
      res.status(400).json({ error: "description and eventName is must."})
    }
    else{
      const eventPost = await db.eventpost.createEventPost(eventName, description, mentions, startsOn, endsOn, req)

      // for shared
      const primary = true
      const sharedDescription = null
      

      var response = await db.post.createNewPost(postContentType, primary, sharedDescription, mentions,  eventPost._id, req.userData.userId, postLocation, eventPost.hashtags)

      res.status(200).json(response)
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}



exports.updateEvent = async (req, res) => {
  try {
    const { eventPostId, eventName, description, mentions,  startsOn, endsOn } = req.body
    const updatePost = await db.eventpost.pollUpdate(eventPostId, eventName, description, mentions, startsOn, endsOn, req.userData.userId)

    res.status(200).json(updatePost)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

