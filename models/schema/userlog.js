const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserLogSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reactType: {
        type: String,
        enum: ['like', 'comment', 'visit', 'share'],
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }

}, { timestamps: true })


UserLogSchema.statics.createLog = async function (userId, postId, reactType) {
    try {
        const data = {
            user: userId,
            post: postId,
            reactType: reactType
        }
        createLog = await this.create(data)
         
      return createLog;
    } catch (error) {
      throw error;
    }
  }
  
var UserLog = mongoose.model('UserLog', UserLogSchema)
module.exports = UserLog;
