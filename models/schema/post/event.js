const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const mongoosastic = require('mongoosastic')


const EventSchema = new mongoose.Schema({

    eventName: String,
    description: String,
    mentions: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    poster: String,
    postBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    interested: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    startsOn: Date,
    endsOn: Date,
    hashtags: [String],

}, {
    timestamps: true
})


//controller functions
EventSchema.statics.createEventPost = async function (eventName, description, startsOn, endsOn, req) {
    try {
        const eventPoster = "/eventposter/" + req.file.filename

        // create event 
        const eventData = {
            eventName: eventName,
            description: description,
            mentions: mentions,
            postBy: req.userData.userId,
            startsOn: startsOn,
            endsOn: endsOn,
            poster: eventPoster,
        }
        if (description) {
            eventData.hashtags = description.match(/#[a-z]+/gi)
        }

        newEventPost = await this.create(eventData)

        return newEventPost;
    } catch (error) {
        throw error;
    }
}

EventSchema.statics.eventUpdate = async function (eventPostId, eventName, description, mentions, startsOn, endsOn, userId) {
    try {
        const eventData = {
            eventName: eventName,
            description: description,
            mentions: mentions,
            postBy: req.userData.userId,
            startsOn: startsOn,
            endsOn: endsOn,
            poster: eventPoster,
        }
        if (description) {
            eventData.hashtags = description.match(/#[a-z]+/gi)
        }
        const finalData = _.pickBy(eventData, _.identity)

        updated = await this.findOneAndUpdate({
                _id: eventPostId,
                postBy: userId
            }, finalData, {
                "new": true
            })
            .populate('postBy', 'username _id profilePic name')

        return updated
    } catch (error) {
        throw error;
    }
}

EventSchema.plugin(mongoosastic, {
    'host': "localhost",
    'port': 9200
})



var Event = mongoose.model('Event', EventSchema)

// Event.createMapping({
//   }, (err, mapping) => {
//     if (err) {
//       console.log('error creating mapping (you can safely ignore this)');
//       console.log(err);
//     } else {
//       console.log('mapping created!');
//       // console.log(mapping);
//     }
//   });

Event.syncIndexes()
module.exports = Event;