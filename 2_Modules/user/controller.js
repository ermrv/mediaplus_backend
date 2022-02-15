//....................ALL Imports.......................
const db = require('../../3_SystemKernel/database/models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_KEY = process.env.jwt_key
var _ = require('lodash');


//....................ALL User Page Routes.......................

//write filter function
exports.appStart = async (req, res) => {
  try {

    const { fcmToken } = req.body
    if (fcmToken) {
      updateUser = await db.user.findByIdAndUpdate(req.userData.userId, { $set: { fcmToken: fcmToken } }, { new: true })
    }


    // here write the function to remove unused status from content table 


    const userdata = await db.user.findById({ _id: req.userData.userId }, 'name username profilePic coverPic followers bio following blocked email mobile highlights')
      .populate('highlights.posts', '')
    res.status(200).json({
      userdata,
      fcmToken
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.loginActivity = async (req, res) => {
  try {
    const { macAddress, lastLogin, lat, lng } = req.body

    const data = await db.user.getlogin(req.userData.userId, macAddress, lat, lng)
    res.status(200).json({
      data: data,
      updated: true
    })

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.getLocation = async (req, res) => {
  try {
    const { macAddress, lastLogin, lat, lng } = req.body

    const data = await db.user.getlogin(req.userData.userId, macAddress, lat, lng)
    res.status(200).json(data)

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.privatePosts = async (req, res) => {
  try {
    var response = await db.user.findById({
      _id: req.userData.userId
    })
      .populate({
        path: 'private',
        select: '-comments -similarCards',
        populate: {
          path: 'postBy',
          select: 'username _id profilePic name'
        }
      })
    res.status(200).json(response.private)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.likedPosts = async (req, res) => {
  try {
    var result = await db.user.findById({
      _id: req.userData.userId
    })
      .populate({
        path: 'likedPosts',
        select: '-comments -similarPosts',
        populate: {
          path: 'postBy',
          select: 'username _id profilePic name'
        }
      })

    res.status(200).json(result.likedPosts)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

//todo
exports.recommended = async (req, res) => {
  try {
    var result = await db.user.findById({
      _id: req.userData.userId
    })
      .populate({
        path: 'recommended',
        select: '-comments -similarCards',
        populate: {
          path: 'videoBy',
          select: 'username _id profilePic name'
        }
      })
    res.status(200).json(result.recommended)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

//todo
exports.settings = async (req, res) => {
  try {
    var result = await db.user.findById({
      _id: req.userData.userId
    })
    res.status(200).json(result.settings)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message });
  }
}

//todo 
exports.notifications = async (req, res) => {
  try {
    var result = await db.user.findById({
      _id: req.userData.userId
    })
    res.status(200).json(result.notifications)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

//models
exports.followings = async (req, res) => {
  try {
    const { userId } = req.body
    if (userId) {

      const data = await db.user.followingList(userId)
      res.status(200).json(data.following)
    }
    else {
      const data = await db.user.followingList(req.userData.userId)
      res.status(200).json(data.following)
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

//models
exports.followers = async (req, res) => {
  try {
    const { userId } = req.body
    if (userId) {

      const data = await db.user.followerList(userId)
      res.status(200).json(data.followers)
    }
    else {
      const data = await db.user.followerList(req.userData.userId)
      res.status(200).json(data.followers)
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.blockedList = async (req, res) => {
  try {
    var result = await db.user.findById({
      _id: req.userData.userId
    }).populate('blocked', 'name username')
    res.status(200).json(result.blocked)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.body
    const updateSelf = await db.user.updateOne(
      { _id: req.userData.userId },
      {
        $addToSet: {
          blocked: userId,
        }
      })
    console.log(updateSelf);
    res.status(200).json({
      success: true
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.unBlockUser = async (req, res) => {
  try {
    const { userId } = req.body
    const updateSelf = await db.user.updateOne(
      { _id: req.userData.userId },
      {
        $pull: {
          blocked: userId,
        }
      })
    console.log(updateSelf);
    res.status(200).json({
      success: true
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.follow = async (req, res) => {
  try {
    const { userId } = req.body
    const updateSelf = await db.user.updateOne(
      { _id: req.userData.userId },
      {
        $addToSet: {
          following: userId,
        }
      })
    const updateUser = await db.user.updateOne(
      { _id: userId },
      {
        $addToSet: {
          followers: req.userData.userId,
        }
      })
    console.log(updateSelf);
    console.log(updateUser);

    // for notification
    notificationType = "follow"
    var postId, commentId;
    createNotification = await db.notification.createNotification(req.userData.userId, notificationType, userId, postId, commentId)

    res.status(200).json({
      success: true
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.unFollow = async (req, res) => {
  try {
    const { userId } = req.body
    const updateSelf = await db.user.updateOne(
      { _id: req.userData.userId },
      {
        $pull: {
          following: userId,
        }
      })
    const updateUser = await db.user.updateOne(
      { _id: userId },
      {
        $pull: {
          followers: req.userData.userId,
        }
      })
    console.log(updateSelf);
    console.log(updateUser);
    res.status(200).json({
      success: true
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.body
    var result = await db.user.findOne({
      username: username
    })
    if (result) {
      res.status(200).json({
        existInDb: "true",
        message: "Username is already registered!"
      })
    } else {
      res.status(200).json({
        existInDb: "false",
        message: "Username is not registered!"
      })
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// login
exports.mobileOtp = async (req, res) => {
  try {
    const { mobile } = req.body
    user = await db.user.findOne({ mobile: mobile })
    const response = {
      mobile: mobile,
      dataCreated: new Date()
    }
    if (mobile.length == 10) {
      response.otpSent = "true"
      if (user) {
        response.newUser = "false"
        res.status(200).json(response)
      } else {
        response.newUser = "true"
        res.status(200).json(response)
      }

    } else {
      response.error = "Wrong phone number :("
      response.newuser = "true"
      res.status(400).json(response)
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

};

exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, code } = req.body;
    if (!mobile || !code) {
      res.status(400).json({
        error: "Please Complete required fields..!",
        mobile,
        code
      })
    }
    else if (code != 112233) {
      res.status(400).json({
        error: "Wrong Code",
        mobile,
        code
      });
    } else {
      userdata = await db.user.findOne({ mobile: mobile })
      if (userdata) {
        if (userdata.name) {

          const id = userdata._id
          const mobile = userdata.mobile
          const token = jwt.sign({
            mobile: mobile,
            userId: id
          },
            JWT_KEY,
            {
              expiresIn: "30d"
            })

          res.status(200).json({
            registered: "true",
            userId: id,
            token: token,
            otpVerified: "true",
            login: "true"

          })

        } else {

          const id = userdata._id
          const mobile = userdata.mobile
          const token = jwt.sign({
            mobile: mobile,
            userId: id
          },
            JWT_KEY,
            {
              expiresIn: "30d"
            })

          res.status(200).json({
            registered: "false",
            userId: id,
            token: token,
            otpVerified: "true",
            login: "true"

          })
        }
      }
      else {
        //creating new user (Initial data entry to db.)
        // create default profile pic and cover pics default
        newUser = await db.user.create({
          mobile: mobile,
        })

        // // Initialise content schema for new user
        // newsfeed = await db.content.initialiseUser(newUser._id)
        // Initialise status schema
        status = await db.status.initialiseUser(newUser._id)

        const id = newUser._id
        const token = jwt.sign({
          mobile: mobile,
          userId: id
        },
          JWT_KEY,
          {
            expiresIn: "30d"
          })
        res.status(200).json({
          login: "true",
          userId: id,
          token: token,
          otpVerified: "true",
          registered: "false"
        })
      }

    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.updateEmail = async (req, res) => {
  try {
    if (email) {
      userData = await db.user.findOne({ mobile: req.userData.mobile })
      if (userData) {
        updateEmail = await db.user.findOneAndUpdate({ mobile: req.userData.mobile }, { $set: { email: email } })

        const response = {
          otpSent: "true",
          emailUpdated: "true",
          mobile: req.userData.mobile,
        }
        res.status(200).json(response)
      } else {
        const response = {
          error: "Something Went wrong.!",
        }
        res.status(200).json(response)
      }

    } else {
      const response = {
        error: "Enter Your email correctly.",
      }
      res.status(400).json(response)
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { code } = req.body
    userData = await db.user.findOne({ mobile: req.userData.mobile })
    if (code == "123456") {
      res.status(200).json({
        emailVerified: "true"
      })
    }
    else {
      res.status(400).json({
        emailVerified: "false",
        message: "Something went wrong.!"
      })

    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

};

//models
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, username, birthday, gender, location, bio } = req.body;
    updatedUser = await db.user.updateUser(req.userData.userId, name, password, email, username, birthday, gender, location, bio)
    res.status(200).json({
      login: "true",
      registered: "true",
      userData: updatedUser
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//models
exports.userProfile = async (req, res) => {
  try {

    const userdata = await db.user.profileDetail(req.userData.userId)
    res.status(200).json(userdata)

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.otherUserProfile = async (req, res) => {
  try {
    const { userId } = req.body

    const userdata = await db.user.profileDetail(userId)
    res.status(200).json(userdata)

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
      res.status(400).json({
        error: "Please Complete all fields..!",
      })
    }
    else {
      userdata = await db.user.findById({ _id: req.userData.userId }, 'password')

      if (userdata.password == password) {
        updatedData = await db.user.findByIdAndUpdate({ _id: req.userData.userId },
          {
            $set: {
              password: req.body.newPassword
            }
          }, { new: true })
        if (updatedData) {
          res.status(200).json({
            success: "true",
            message: "Password changed Successfully"
          })
        } else {
          res.status(200).json({
            success: "false",
            messege: "Something went wrong",
          })
        }
      }
      else {
        res.status(200).json({
          success: "false",
          message: "You have entered wrong password"
        })
      }
    };
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.passLogin = async (req, res) => {
  try {

    const { mobile, password, email } = req.body
    const response = {
      mobile: mobile
    }
    if (mobile && password) {
      const userR = await db.user.findOne({ mobile: mobile })

      if (userR) {
        // user Exists 
        if (userR.mobile == mobile && userR.password == password) {
          const response = {
            login: "true",
            name: userR.name,
            newuser: "false",
            mobile: mobile,
            lastLogin: new Date,
          };
          const id = userR._id
          const token = jwt.sign({
            mobile: mobile,
            userId: id
          }, JWT_KEY, { expiresIn: "30d" })
          response.token = token
          response._id = id
          res.status(200).json(response)
        } else {
          response.login = "false"
          response.error = "Wrong Credentials, Please enter correct Mobile No. and Password..!"
          response.newuser = "false",
            res.status(400).json(response)
        }
      } else {
        response.error = "Your mobile no is not yet registered, Register first.!"
        response.newuser = "true",
          res.status(400).json(response)
      }

    }
    else if (email && password) {
      const userData = await db.user.findOne({ email: email })
      if (userData) {
        if (userData.emailVerified == "true") {
          if (userData.email == email && userData.password == password) {
            const response = {
              login: "true",
              name: userData.name,
              newuser: "false",
              lastLogin: new Date,
            };
            const id = userData._id
            const mobile = userData.mobile
            const token = jwt.sign({
              mobile: mobile,
              userId: id
            }, JWT_KEY, { expiresIn: "30d" })
            response.token = token
            response._id = id
            res.status(200).json(response)
          } else {
            response.login = "false"
            response.error = "Wrong Credentials, Please enter correct Mobile No. and Password..!"
            response.newuser = "false",
              res.status(400).json(response)
          }

        } else {
          response.error = "Your email is not verified, login through mobile no or otp"
          response.newuser = "true",
            res.status(400).json(response)
        }

      } else {
        response.error = "You are not yet registered, Register first.!"
        response.newuser = "true",
          res.status(400).json(response)
      }
    }
    else {
      response.error = "Please Complete all fields Correctly..!"
      response.newuser = "true",
        res.status(400).json(response);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

//models
exports.register = async (req, res) => {
  try {
    const { name, password, email, username, birthday, gender, location, bio } = req.body;
    updatedUser = await db.user.updateUser(req.userData.userId, name, password, email, username, birthday, gender, location, bio)
    res.status(200).json({
      login: "true",
      registered: "true",
      userData: updatedUser
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// testing pupose  // TO Do: remove this api
exports.addUser = async (req, res) => {
  try {
    const { name, mobile, email, username } = req.body;
    addUser = await db.user.create({
      name: name,
      mobile: mobile,
      email: email,
      username: username
    })

    status = await db.status.initialiseUser(addUser._id)


    res.status(200).json(addUser)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

//models
exports.profilePicUpdate = async (req, res) => {
  try {
    const profilePic = "/pictures/" + req.file.filename
    updatedUser = await db.user.updateProfilePic(req.userData.userId, profilePic)
    res.status(200).json({
      profilePicUpdated: "true",
      userData: updatedUser
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.coverPicUpdate = async (req, res) => {
  try {
    const coverPic = "/coverpic/" + req.file.filename
    updatedUser = await db.user.updateCoverPic(req.userData.userId, coverPic)
    res.status(200).json({
      coverPicUpdated: "true",
      userData: updatedUser
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
