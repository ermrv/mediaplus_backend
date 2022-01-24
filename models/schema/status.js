const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var statusContent = new Schema({
    mimetype: String,
    path: String,
    size: Number,
    hash: String,
    statusText: String,
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],

    active: {
        type: Boolean,
        default: true
    },
    expiryTime: {
        type: Number,
        // default: Date.now() + 86400000     // current time + 24hr
    },
    seenBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true })

const StatusSchema = new mongoose.Schema({
    statusContents: [statusContent],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    statusUpto: {
        type: String,
    }
})

//controller functions

StatusSchema.statics.initialiseUser = async function (userId) {
    try {
        // create status schema 
        newSchema = await this.create({
            userId: userId,
            statusContents: []
        })
        console.log("Status schema successfully initialised.")
    } catch (error) {
        throw error;
    }
}

StatusSchema.statics.currentStatus = async function (userId) {
    try {
        // Import user
        User = require('./user')
        userData = await User.findById(userId, 'following -_id')
        if (!userData) {
            return
        } else {
            userData.following.push(userId)

            var statusData = await this.find({
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
                if (out.statusContents.length > 0) {
                    response.push(out)
                }
            }
            return response
        }
    } catch (error) {
        throw error;
    }
}

var Status = mongoose.model('Status', StatusSchema)
module.exports = Status;
