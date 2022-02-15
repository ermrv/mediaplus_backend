const mongoose = require('mongoose');
const posts = require('./post/post');
var Schema = mongoose.Schema;
const _ = require('lodash');
const mongoosastic = require('mongoosastic')

var NodeGeocoder = require('node-geocoder');
require('dotenv').config()

// settings schema to be used inside user schema
var pushNotificationSettings = new Schema({
  newFollowerNotification: {
    type: String,
    default: "true"
  },
  likeNotification: {
    type: String,
    default: "true"
  },
  commentNotification: {
    type: String,
    default: "true"
  },
  
  mentionNotification: {
    type: String,
    default: "true"
  },
  securityNotification: {
    type: String,
    default: "true"
  },

});


// login activity schema, to be used inside user schema
const loginActivity = new Schema({
  macAddress: String,
  lastLogin: {
    type: Date,
    default: Date.now()
  },
  lat: String,
  lng: String,
  location: String,
  token: String,

}, { timestamps: true })


///user schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  profilePic: {
    type: String,
    default: "/pictures/profile_default.jpeg"
  },
  coverPic: {
    type: String,
    default: "/coverpic/cover_default.jpg"
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  birthday: {
    type: Date,
    default: "2000-01-01T00:00:00.000Z",
    trim: true
  },
  accountType: {
    type: String,
    default: "public"
  },
  bio: {
    type: String,
    trim: true
  },
  username: {
    type: String,
  },
  fcmToken: {
    type: String,
  },

  location: {
    type: String,
    trim: true
  },
  lat: {
    type: String,
    trim: true
  },
  lng: {
    type: String,
    trim: true
  },
  mobile: {
    type: String,
    unique: true
  },
  password: String,
  email: {
    type: String,
    // trim: true,
    // unique: true,
    // sparse: true
  },
  emailVerified: {
    type: String,
    default: false,
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  blocked: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  recommended: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  newsfeedPosts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  notificationSettings:pushNotificationSettings,
  loginActivity: [loginActivity],
  notificationGroups: [String],
}, { timestamps: true });


// controller functions

UserSchema.statics.profileDetail = async function (userId) {
  try {
    userData = await this.findOne({ _id: userId }).select('name username mobile email gender profilePic coverPic birthday bio location interests privateProfile followers following')
    return userData;
  } catch (error) {
    throw error;
  }
}


UserSchema.statics.followingList = async function (userId) {
  try {
    userData = await this.findOne({ _id: userId })
      .populate('following', 'name username profilePic')
    return userData;
  } catch (error) {
    throw error;
  }
}

UserSchema.statics.followerList = async function (userId) {
  try {
    userData = await this.findOne({ _id: userId })
      .populate('followers', 'name username profilePic')
    return userData;
  } catch (error) {
    throw error;
  }
}

UserSchema.statics.updateUser = async function (userId, name, password, email, username, birthday, gender, location, bio) {
  try {
    const newData = {
      name: name,
      password: password,
      email: email,
      username: username,
      gender: gender,
      birthday: birthday,
      bio: bio,
      location: location
    }
    const finalData = _.pickBy(newData, _.identity)



    updatedUser = await this.findOneAndUpdate({ _id: userId }, finalData, { "new": true }).select('name email gender birthday bio location profilePic username')
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

UserSchema.statics.updateProfilePic = async function (userId, profilePic) {
  try {

    updatedUser = await this.findOneAndUpdate({ _id: userId }, { profilePic: profilePic }, { "new": true }).select('profilePic')
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

UserSchema.statics.updateCoverPic = async function (userId, coverPic) {
  try {

    updatedUser = await this.findOneAndUpdate({ _id: userId }, { coverPic: coverPic }, { "new": true }).select('coverPic')
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

///update user settings
UserSchema.statics.updateSettings= async function(userId, settingsData){
  try{
      const user= this.findOne({"_id":userId})
      var settings=user.pushNotificationSettings
      
      //update settings
      settings.securityNotification=settingsData.securityNotification;
      settings.likeNotification=settingsData.likeNotification;
      settings.mentionNotification=settingsData.mentionNotification;
      settings.commentNotification=settingsData.commentNotification;

      user.save();

      return user.pushNotificationSettings;

  }catch(error){
    throw error;
  }
}

// check
UserSchema.statics.userPosts = async function (userId) {
  try {
    userData = await this.findOne({ _id: userId }, 'posts')
    data = await posts.arrayPostDetail(userData.posts)

    return data;
  } catch (error) {
    throw error;
  }
}

UserSchema.statics.addPostToUser = async function (userId, postId) {
  try {
    await this.updateOne({ _id: userId }, {
      $addToSet: { posts: postId }
    }, { "upsert": true })
  } catch (error) {
    throw error;
  }
}

UserSchema.statics.addToNewsFeeds = async function (userId, postId) {
  try {
    userData = await this.findById(userId)
    followers = userData.followers
    followers.push(userId)       // self id is also added

    // add postId to these user (newsfeedPosts)
    addPost = await this.updateMany({ _id: { $in: followers } }, { $addToSet: { newsfeedPosts: postId } }, { upsert: true })

  } catch (error) {
    throw error;
  }
}

// Managing login activity
UserSchema.statics.getlogin = async function (userId, macAddress, lat, lng) {
  try {

    newData = {}

    if (lat && lng) {
      var options = {
        provider: 'google',
        httpAdapter: 'https', // Default
        apiKey: process.env.apiKey,
        formatter: 'json' // 'gpx', 'string', ...
      };

      var geocoder = NodeGeocoder(options);
      location = await geocoder.reverse({ lat: lat, lon: lng })

      if (location[0].administrativeLevels.level2long) {
        newData.district = location[0].administrativeLevels.level2long
      }
      if (location[0].city) {
        newData.city = location[0].city
      }
      if (location[0].country) {
        newData.country = location[0].country
      }
    }
    newData.macAddress = macAddress

    updateLocation = await this.findByIdAndUpdate({ _id: userId }, { $set: { location: location[0].city, lat: lat, lng: lng } })


    return newData
  } catch (error) {
    throw error;
  }
}

UserSchema.statics.userArrayDetails = async function (userArray) {
  try {
    data = await this.find({ _id: { $in: userArray } }, 'username _id profilePic name')
    return data
  } catch (error) {
    throw error
  }
}

UserSchema.plugin(mongoosastic, {
  'host': "localhost",
  'port': 9200
})
var User = mongoose.model('User', UserSchema, 'users')


User.createMapping({
}, (err, mapping) => {
  if (err) {
    console.log('error creating mapping (you can safely ignore this)');
    console.log(err);
  } else {
    console.log('mapping created!');
  }
});



// var newUser = new User({
//   name: "Maniraj Kumar",
//   email: "mayank2@gmail.com",
//   mobile: "1111122222"
// })
// newUser.save((err) =>{
//   if(err){
//     console.log(err)
//   }
// })

// newUser.on('es-indexed', (err, result) => {
//   console.log('indexed to elastic search');
// });

User.syncIndexes()
module.exports = User;
