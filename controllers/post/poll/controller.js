//....................ALL Imports.......................
const db = require('../../../database/models');


//....................ALL Poll Routes.......................   


exports.addNewPost = async (req, res) => {
  try {
    const { postLocation, description, mentions, opOne, opTwo, opThree, opFour, opFive, endsOn } = req.body
    const postContentType = "poll"
    if (!description || !endsOn || !opOne || !opTwo) {
      res.status(400).json({ error: "Description, endsOn and atleast two options are required.!" })
    }
    else {
      const pollPost = await db.pollpost.createPollPost(description, mentions, opOne, opTwo, opThree, opFour, opFive, endsOn, req.userData.userId)
      // for shared
      const primary = true
      const sharedDescription = null

      var response = await db.post.createNewPost(postContentType, primary, sharedDescription, mentions,   pollPost._id, req.userData.userId, postLocation, pollPost.hashtags)

      res.status(200).json(response)
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.reactPoll = async (req, res) => {
  try {
    const { pollPostId, optionChoice } = req.body
    if (!pollPostId) {
      return res.status(400).json({ error: "Enter required fields...!" });
    } else if (optionChoice < 0 || optionChoice > 5) {
      return res.status(400).json({ error: "Invalid option choice...!" });
    } else {
      if(optionChoice == 0){
        // remove poll reaction
        const pollReact = await db.pollpost.pollReactRemove(pollPostId, req.userData.userId)
        res.status(200).json(pollReact)
      }else{
        const pollReact = await db.pollpost.pollReact(pollPostId, optionChoice, req.userData.userId)
        res.status(200).json(pollReact)
      }

    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.updatePoll = async (req, res) => {
  try {
    const { pollPostId, description, opOne, opTwo, opThree, opFour, opFive, endsOn } = req.body
    const updatePost = await db.pollpost.pollUpdate(pollPostId, description, opOne, opTwo, opThree, opFour, opFive, endsOn, req.userData.userId)

    res.status(200).json(updatePost)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

