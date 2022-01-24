const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const user = require('./../../../models/schema/user');
const contestthread = require('./../../../models/schema/contestthread');
const mongoosastic = require('mongoosastic')


var data = new Schema({
    mimetype: {
        type: String,
        enum: ['image/jpeg', 'image/png', 'image/jpg']
    },
    path: String,
    size: Number,
})

const ContestSchema = new mongoose.Schema({

    contestName: String,
    description: String,
    contestRules: [String],
    contestBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    mentions: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    poster: String,
    coins: Number,
    contestWinner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    endsOn: {
        type: Date,
        required: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    //Messaging
    chatThread: {
        type: Schema.Types.ObjectId,
        ref: 'ContestThread'
    },
    hashtags: [String],

}, {
    timestamps: true
})



//controller functions
ContestSchema.statics.createNewContest = async function (contestName, description, contestRules, coins, endsOn, req) {
    try {

        // create thread if not created and enter thread into organiser id and remove coin from organiser
        //  create thread

        const thread = {
            chatUsers: [req.userData.userId],
            organiser: req.userData.userId,
            messages: []
        }

        newThread = await contestthread.create(thread)

        // decrease coins from organiser
        updateCoin = await user.updateOne({
            _id: req.userData.userId
        }, {
            "$inc": {
                "coins": -coins
            }
        })





        // create contest 
        const contestData = {
            contestName: contestName,
            description: description,
            mentions: mentions,
            contestRules: contestRules,
            contestBy: req.userData.userId,
            coins: coins,
            endsOn: endsOn,
            participants: [],
            chatThread: newThread._id
        }
        if (req.file) {
            const contestPoster = "/contestposter/" + req.file.filename
            contestData.poster = contestPoster
        }




        if (description) {
            contestData.hashtags = description.match(/#[a-z]+/gi)
        }

        newContest = await this.create(contestData)

        return newContest;
    } catch (error) {
        throw error;
    }
}

ContestSchema.plugin(mongoosastic, {
    'host': "localhost",
    'port': 9200
})


var Contest = mongoose.model('Contest', ContestSchema)

// Contest.createMapping({ 
//   }, (err, mapping) => {
//     if (err) {
//       console.log('error creating mapping (you can safely ignore this)');
//       console.log(err);
//     } else {
//       console.log('mapping created!');
//     }
//   });

Contest.syncIndexes()
module.exports = Contest;