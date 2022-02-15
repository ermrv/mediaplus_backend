//....................ALL Imports.......................
const db = require('./../../../3_SystemKernel/database/models');
var _ = require('lodash');
const { imageHash } = require('image-hash');


const getImageHash = (...args) => {
  return new Promise((resolve, reject) => {
    imageHash(...args, (error, data) => {
      if (error) reject(error);
      resolve(data);
    });
  });
}


//....................ALL Contest Routes.......................   


exports.addNewContest = async (req, res) => {
  try {
    const { contestName, postLocation, description,  contestRules, coins, endsOn } = req.body
    const postContentType = "contest"
    //check coin and decrease it (whether he is able to host or not)
    const organiser = await db.user.findById({ _id: req.userData.userId }, 'coins')

    //check fields required
    if (!contestName || !description || !coins || coins < 0) {
      res.status(400).json({ error: "Required fields are missing." })
    } else if (organiser.coins < coins) {
      res.status(301).json({ error: "You don't have sufficient coins to host this contest" })
    }
    else {

      newContest = await db.contest.createNewContest(contestName, description,  contestRules, coins, endsOn, req)

      // for shared
      const primary = true
      const sharedDescription = null

      var response = await db.post.createNewPost(postContentType, primary, sharedDescription, mentions,   newContest._id, req.userData.userId, postLocation, newContest.hashtags)

      res.status(200).json(response)
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.addPoster = async (req, res) => {
  try {
    const { contestId } = req.body

    const contestPoster = "/contestposter/" + req.file.filename

    const updatedContest = await db.contest.findOneAndUpdate({ _id: contestId, contestBy: req.userData.userId }, {
      $set: {
        poster: contestPoster
      }
    }, { "new": true }).select('poster')

    res.status(200).json({
      posterUpdated: "true",
      contest: updatedContest
    })
  }

  catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.addContestPost = async (req, res) => {
  try {
    const { postContentType, description, mentions, contestId, aspectRatio, templateType, location } = req.body
    if (!contestId) {
      res.status(400).json({ error: "ContestId is required.!" })
    }
    else {

      var fileDetails = [];
      for (var f of req.files) {
        var e = {};
        if (f.mimetype === 'image/jpeg' || f.mimetype === 'image/png' || f.mimetype === 'image/jpg') {
          e.hash = await getImageHash(f.path, 16, true);
        }
        e.mimetype = f.mimetype,
          e.path = "/posts/".concat(f.filename)
        e.size = f.size
        fileDetails.push(e);
      }

      const post = {
        postContent: fileDetails,
        postContentType: postContentType,
        postBy: req.userData.userId,
        aspectRatio: aspectRatio,
        templateType: templateType,
        location: location,
        postType: 'image',
        postLink: 'https://google.com',
        nice: [],
        love: [],
        cool: [],
        haha: [],
        wow: [],
        description: description,
        mentions: mentions,
        hashtags: description.match(/#[a-z]+/gi),
        postCreated: Date.now()
      }
      const response = await db.post.create(post)

      // Update self profile
      updateUser = await db.user.updateOne(
        { _id: req.userData.userId },
        {
          $addToSet: {
            posts: response._id
          }
        }, { "upsert": true })


      // Post sent to self Newsfeed
      updateContent = await db.content.updateOne(
        {
          userId: req.userData.userId,
          contentType: "userNewsfeed",
          'boxes.viewType': "userPosts"
        }, {
        $addToSet: {
          'boxes.$.boxContents.contents': response._id
        }
      })

      // Post sent to all user videos, newsfeed, 
      if (req.files[0].mimetype == "video/mp4") {

        //update videos homepage: userHomeVideos
        var vidTitle = ["New Videos", "Short Videos", "Trending Videos", "Favourite Videos", "You may watch."]
        for (let i = 0; i < 5; i++) {
          updateEveryProfile = await db.content.updateMany({
            contentType: "userHomeVideos",
            // 'boxes.viewType': "videoReference",
            "boxes.boxContents.title": vidTitle[i]
          }, {
            $addToSet: {
              'boxes.$.boxContents.contents': response._id,
            },
          })
        }

        //update homepageNearYou
        var nearYou = ["Short Videos", "Long Videos"]
        for (let i = 0; i < 2; i++) {
          updateEveryProfile = await db.content.updateMany(
            {
              contentType: "homepageNearYou",
              // 'boxes.viewType': "videoReference",
              "boxes.boxContents.title": nearYou[i]
            }, {
            $addToSet: {
              'boxes.$.boxContents.contents': response._id,
            },
          })
        }

        //update homepageExplore
        var explore = ["Short Videos", "Long Videos", "Today's special near you"]
        for (let i = 0; i < 3; i++) {
          updateEveryProfile = await db.content.updateMany(
            {
              contentType: "homepageExplore",
              // 'boxes.viewType': "videoReference",
              "boxes.boxContents.title": explore[i]
            }, {
            $addToSet: {
              'boxes.$.boxContents.contents': response._id,
            },
          })
        }

      }
      //add postId to contests

      const updateContest = await db.contest.findByIdAndUpdate({ _id: contestId }, { $addToSet: { participants: response._id } })

      // add user to contest thread

      const updateThread = await db.contestthread.updateOne({ _id: updateContest.chatThread }, { $addToSet: { chatUsers: req.userData.userId } })

      //add contestId to participants

      const updateUser = await db.user.updateOne({ _id: req.userData.userId }, { $addToSet: { contestParticipated: contestId } })

      res.status(200).json(response)

    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.organisedContests = async (req, res) => {
  try {
    userData = await db.user.findOne({ _id: req.userData.userId }, 'contestOrganised')
      .populate({
        path: 'contestOrganised',
        select: '',
        populate: {
          path: 'contestBy',
          select: 'username _id profilePic name'
        }
      })

    res.status(200).json(userData.contestOrganised)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.participatedContest = async (req, res) => {
  try {
    userData = await db.user.findOne({ _id: req.userData.userId }, 'contestParticipated')
      .populate({
        path: 'contestParticipated',
        select: '',
        populate: {
          path: 'contestBy',
          select: 'username _id profilePic name'
        }
      })

    res.status(200).json(userData.contestParticipated)

    res.status(200).json()
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.contestPosts = async (req, res) => {
  try {
    const { contestId } = req.body

    contestData = await db.contest.findById({ _id: contestId }, 'participants -_id')
      .populate({
        path: 'participants',
        select: 'postContentType hashtags noOfComments niceReactCount loveReactCount coolReactCount hahaReactCount wowReactCount postContent postBy postLink description postCreated createdAt updatedAt',
        populate: {
          path: 'postBy',
          select: 'username _id profilePic name'
        }
      })

    res.status(200).json(contestData.participants)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.ownerContestPostRemove = async (req, res) => {
  try {
    const { contestId, postId } = req.body
    if (!contestId || !reason) {
      res.status(400).json({ error: "enter required fields.!" })
    } else {
      const contest = await db.contest.findOne({ contestBy: req.userData.userId })
      if (contest) {
        // remove postId form contest
        removePost = await db.contest.findOneAndUpdate({ _id: contestId, participants: { $in: postId } }, { $pull: { participants: postId } }, { new: true })

        if (removePost) {
          // remove from user data (not done)
          res.status(200).json(removePost)

        } else {
          res.status(400).json({ error: "Post not available in contest" })
        }

      } else {
        res.status(400).json({ error: "You have not permission.!" })
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.contestRemoveReq = async (req, res) => {
  try {
    const { contestId, reason } = req.body
    if (!contestId || !reason) {
      res.status(400).json({ error: "enter required fields.!" })
    } else {
      const contest = await db.contest.findOne({ contestBy: req.userData.userId })
      if (contest) {
        const checkRepeatReq = await db.contestrequest.findOne({ contest: contestId })
        if (checkRepeatReq) {
          res.status(400).json({ error: "Already requested.!" })
        } else {
          const request = {
            contest: contest._id,
            owner: req.userData.userId,
            reason: reason
          }
          const createReq = await db.contestrequest.create(request)
          res.status(200).json(createReq)

        }
      } else {
        res.status(400).json({ error: "You have not permission.!" })
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.contestRemoveRequestList = async (req, res) => {
  try {
    requests = await db.contestrequest.find({ owner: req.userData.userId })

    res.status(200).json(requests)

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.removeParticipation = async (req, res) => {
  try {
    const { contestId, postId } = req.body
    // remove from contest and remove contestId from contestParticipated in users table

    if (!contestId || !postId) {
      res.status(400).json({ error: "Enter required fields.!" })
    } else {

      checkcontest = await db.post.findOne({ _id: postId, postBy: req.userData.userId }, '_id')

      if (checkcontest) {
        contestUpdate = await db.contest.updateOne({ _id: contestId }, { $pull: { participants: postId } })

        userUpdate = await db.user.updateOne({ _id: req.userData.userId }, { $pull: { contestParticipated: contestId } })

        // remove user to contest thread

        const updateThread = await db.contestthread.updateOne({ _id: updateContest.chatThread }, { $pull: { chatUsers: req.userData.userId } })

        res.status(200).json({ removed: true })

      } else {
        res.status(400).json({ error: "You dont have permission" })
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.contestReaction = async (req, res) => {
  try {
    const { reaction, contestId } = req.body
    if (reaction != 0 && reaction != 1 && reaction != 2) {
      res.status(400).json({ error: "reaction should be only 0/1/2" })
    }
    else {
      if (reaction == 0) {
        //pull from both like and dislike
        updateContest = await db.contest.updateOne({ _id: contestId }, {
          $pull: {
            likes: req.userData.userId,
            disLikes: req.userData.userId,
          }
        })

        res.status(200).json({ reacted: true })
      } else if (reaction == 1) {
        // pull from dislikes and pull to likes 
        updateContest = await db.contest.updateOne({ _id: contestId }, {
          $pull: {
            disLikes: req.userData.userId,
          },
          $addToSet: {
            likes: req.userData.userId
          }
        })

        res.status(200).json({ reacted: true })
      }
      else if (reaction == 2) {
        // pull from likes and pull to dislikes 
        updateContest = await db.contest.updateOne({ _id: contestId }, {
          $pull: {
            likes: req.userData.userId,
          },
          $addToSet: {
            disLikes: req.userData.userId
          }
        })

        res.status(200).json({ reacted: true })
      }
      else {
        res.status(400).json({ error: "Input correctly.!" })
      }

    }



    res.status(200).json()
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.reactions = async (req, res) => {
  try {
    const { contestId } = req.body

    const contestData = await db.contest.findById({ _id: contestId }, 'likes disLikes')
      .populate('likes', 'username _id profilePic name')
      .populate('disLikes', 'username _id profilePic name')

    res.status(200).json()
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// contest chat system

exports.contestThread = async (req, res) => {
  try {
    const { threadId } = req.body


    contestThreadData = await db.contestthread.findById({ _id: threadId })
      .populate('chatUsers', 'username _id profilePic name')
      .populate('organiser', 'username _id profilePic name')
      .populate('messages.byUser', 'username _id profilePic name')



    res.status(200).json(contestThreadData)

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.sendMessage = async (req, res) => {
  try {
    const { message, threadId } = req.body
    //check he can send or not 
    checkUser = await db.contestthread.findOne({ _id: threadId, chatUsers: { $in: req.userData.userId } })
    if (checkUser) {

      messageData = {
        message: message,
        byUser: req.userData.userId
      }
      sendMessage = await db.contestthread.findOneAndUpdate({ _id: threadId, chatUsers: { $in: req.userData.userId } }, {
        $push: {
          messages: messageData
        }
      }, { new: true })
        .populate('chatUsers', 'username _id profilePic name')
        .populate('organiser', 'username _id profilePic name')
        .populate('messages.byUser', 'username _id profilePic name')
      res.status(200).json(sendMessage)

    } else {
      return res.status(400).json({ error: "You have not permission to chat without participating.!" });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.setThreadDescription = async (req, res) => {
  try {
    const { description, threadId } = req.body
    //check he can send or not 
    checkOrganiser = await db.contestthread.findOne({ _id: threadId, organiser: req.userData.userId })
    if (checkOrganiser) {


      setDescription = await db.contestthread.findOneAndUpdate({ _id: threadId, organiser: req.userData.userId }, {
        $set: {
          description: description
        }
      }, { new: true })

      res.status(200).json({ description: setDescription.description })

    } else {
      return res.status(400).json({ error: "You have not permission.!" });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.reportMessage = async (req, res) => {
  try {
    const { messageId, threadId, reason } = req.body

    checkThread = await db.contestthread.findOne({ _id: threadId, chatUsers: { $in: req.userData.userId } })

    if (checkThread) {
      chatReportData = {
        threadId: threadId,
        messageId: messageId,
        byUser: req.userData.userId,
        reason: reason
      }
      reports = await db.chatreport.create(chatReportData)

      res.status(200).json(reports)

    } else {
      res.status(400).json({ error: "You have not permission.!" });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}


// results api









