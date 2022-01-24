//....................ALL Imports.......................
const db = require('../../models');
var _ = require('lodash');

//....................ALL Post Page Routes.......................   

// without condition fetch history  
exports.statusHistory = async (req, res) => {
  try {


    checkStatus = await db.status.findOne({ userId: req.userData.userId })
    if (!checkStatus) {
      // create status schema 
      newSchema = await db.status.create({
        userId: userId,
        statusContents: []
      })
      console.log("Status schema successfully initialised.")

    }

    var result = await db.status.findOne({
      userId: req.userData.userId
    })
      .populate({
        path: 'userId',
        select: 'username _id profilePic name',
      })

    res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// with condition retrive status 
exports.status = async (req, res) => {
  try {

    userData = await db.user.findById(req.userData.userId, 'following -_id')
    userData.following.push(req.userData.userId)

    var statusData = await db.status.find({
      userId: {
        $in: userData.following
      }
    })
      .populate({
        path: 'userId',
        select: 'username _id profilePic name',
      })

    const currentDate = Date.now()
    const response = []
    for (let j = 0; j < statusData.length; j++) {
      const out = {}
      out._id = statusData[j]._id
      out.userId = statusData[j].userId
      array = []
      for (let i = 0; i < statusData[j].statusContents.length; i++) {
        if (statusData[j].statusContents[i].expiryTime >= currentDate) {
          array.push(statusData[j].statusContents[i])
        }
      }
      out.statusContents = array
      if(out.statusContents.length >0){
        response.push(out)
      }
    }

    res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.addStatus = async (req, res) => {
  try {
    checkStatus = await db.status.findOne({ userId: req.userData.userId })
    if (!checkStatus) {
      // create status schema 
      newSchema = await db.status.create({
        userId: userId,
        statusContents: []
      })
      console.log("Status schema successfully initialised.")

    }

    const { statusText } = req.body
    expiryTimeData = Date.now() + 86400000
    const statusData = {
      mimetype: req.file.mimetype,
      path: "/status/".concat(req.file.filename),
      size: req.file.size,
      expiryTime: expiryTimeData,
      statusText: statusText,
    }

    result = await db.status.findOneAndUpdate({ userId: req.userData.userId }, { $addToSet: { statusContents: statusData } }, { new: true })

    const currentDate = Date.now()
    const response = {}
    response._id = result._id
    response.userId = result.userId
    array = []
    for (let i = 0; i < result.statusContents.length; i++) {
      if (result.statusContents[i].expiryTime >= currentDate) {
        array.push(result.statusContents[i])
      }
    }
    response.statusContents = array

    res.status(200).json(response)







  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// this can be used to delete from history too if statusId is sent 
exports.removeStatus = async (req, res) => {
  try {
    const { statusId } = req.body
    // remove from status
    result = await db.status.findOneAndUpdate({ userId: req.userData.userId }, { $pull: { statusContents: { _id: statusId } } }, { new: true })

    const currentDate = Date.now()
    const response = {}
    response._id = result._id
    response.userId = result.userId
    array = []
    for (let i = 0; i < result.statusContents.length; i++) {
      if (result.statusContents[i].expiryTime >= currentDate) {
        array.push(result.statusContents[i])
      }
    }
    response.statusContents = array

    res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.statusReaction = async (req, res) => {
  try {
    const { statusId, contentId, like } = req.body
    if (!statusId || !contentId) {
      res.status(400).json({ error: "Enter required fields.!" })
    } else {
      if (like) {
        addReaction = await db.status.findOneAndUpdate({ _id: statusId, 'statusContents._id': contentId }, { $addToSet: { 'statusContents.$.likes': req.userData.userId } }, { new: true })
        res.status(200).json(addReaction)
      }
      else {
        addReaction = await db.status.findOneAndUpdate({ _id: statusId, 'statusContents._id': contentId }, { $pull: { 'statusContents.$.likes': req.userData.userId } }, { new: true })
        res.status(200).json(addReaction)
      }
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.reactedUsers = async (req, res) => {
  try {
    const { statusId, contentId } = req.body
    if (!statusId || !contentId) {
      res.status(400).json({ error: "Enter required fields.!" })
    } else {

      subdoc = await db.status.findOne({ _id: statusId }, { statusContents: { $elemMatch: { _id: contentId } } })
        .populate({
          path: 'statusContents.likes',
          select: 'username _id profilePic name',
        })

      res.status(200).json(subdoc.statusContents[0].likes)

    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

