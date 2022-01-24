const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const _ = require('lodash');
const mongoosastic = require('mongoosastic')


const PollSchema = new mongoose.Schema({

    description: String,
    endsOn: {
        type: Date,
        required: true
    },
    mentions: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    postBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    opOne: {
        type: String,
        required: true
    },
    opTwo: {
        type: String,
        required: true
    },
    opThree: {
        type: String
    },
    opFour: {
        type: String,
    },
    opFive: {
        type: String,
    },

    totalResponse: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    //response (not to show only for data)
    opOneResponse: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    opTwoResponse: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    opThreeResponse: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    opFourResponse: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    opFiveResponse: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],


}, {
    timestamps: true
})

PollSchema.set('toObject', {
    virtuals: true
})
PollSchema.set('toJSON', {
    virtuals: true
})

PollSchema.virtual('responseCount').get(function () {
    const responseCount = []
    if (this.opOneResponse) {
        responseCount[0] = this.opOneResponse.length
    }
    if (this.opTwoResponse) {
        responseCount[1] = this.opTwoResponse.length
    }
    if (this.opThreeResponse) {
        responseCount[2] = this.opThreeResponse.length
    }
    if (this.opFourResponse) {
        responseCount[3] = this.opFourResponse.length
    }
    if (this.opFiveResponse) {
        responseCount[4] = this.opFiveResponse.length
    }
    return responseCount
});

//controller functions
PollSchema.statics.createPollPost = async function (description, mentions, opOne, opTwo, opThree, opFour, opFive, endsOn, userId) {
    try {
        postData = {
            opOne: opOne,
            opTwo: opTwo,
            opThree: opThree,
            opFour: opFour,
            opFive: opFive,
            postBy: userId,
            description: description,
            mentions: mentions,
            endsOn: endsOn
        }
        if (description) {
            postData.hashtags = description.match(/#[a-z]+/gi)
        }
        newpollPost = await this.create(postData)
        return newpollPost;
    } catch (error) {
        throw error;
    }
}

PollSchema.statics.pollReact = async function (pollPostId, optionChoice, userId) {
    try {
        checkResponse = await this.findOne({
            _id: pollPostId,
            totalResponse: {
                $in: userId
            }
        })
        if (checkResponse) {
            return {
                updated: false,
                error: "already Reacted!"
            }
        } else {

            if (optionChoice == 1) {
                data = await this.findOneAndUpdate({
                    _id: pollPostId
                }, {
                    $addToSet: {
                        opOneResponse: userId,
                        totalResponse: userId
                    }
                }, {
                    new: true
                }).select('opOneResponse opTwoResponse opThreeResponse opFourResponse opFiveResponse')
                return {
                    updated: true,
                    response: data
                }
            } else if (optionChoice == 2) {
                data = await this.findOneAndUpdate({
                    _id: pollPostId
                }, {
                    $addToSet: {
                        opTwoResponse: userId,
                        totalResponse: userId
                    }
                }, {
                    new: true
                }).select('opOneResponse opTwoResponse opThreeResponse opFourResponse opFiveResponse')
                return {
                    updated: true,
                    response: data
                }
            } else if (optionChoice == 3) {
                data = await this.findOneAndUpdate({
                    _id: pollPostId
                }, {
                    $addToSet: {
                        opThreeResponse: userId,
                        totalResponse: userId
                    }
                }, {
                    new: true
                }).select('opOneResponse opTwoResponse opThreeResponse opFourResponse opFiveResponse')
                return {
                    updated: true,
                    response: data
                }
            } else if (optionChoice == 4) {
                data = await this.findOneAndUpdate({
                    _id: pollPostId
                }, {
                    $addToSet: {
                        opFourResponse: userId,
                        totalResponse: userId
                    }
                }, {
                    new: true
                }).select('opOneResponse opTwoResponse opThreeResponse opFourResponse opFiveResponse')
                return {
                    updated: true,
                    response: data
                }
            } else if (optionChoice == 5) {
                data = await this.findOneAndUpdate({
                    _id: pollPostId
                }, {
                    $addToSet: {
                        opFiveResponse: userId,
                        totalResponse: userId
                    }
                }, {
                    new: true
                }).select('opOneResponse opTwoResponse opThreeResponse opFourResponse opFiveResponse')
                return {
                    updated: true,
                    response: data
                }
            } else {
                throw "Invalid option"
            }
        }

    } catch (error) {
        throw error;
    }
}

PollSchema.statics.pollReactRemove = async function (pollPostId, userId) {
    try {
        checkResponse = await this.findOne({
            _id: pollPostId,
            totalResponse: {
                $in: userId
            }
        })
        if (checkResponse) {
            data = await this.findOneAndUpdate({
                _id: pollPostId
            }, {
                $pull: {
                    opOneResponse: userId,
                    opTwoResponse: userId,
                    opThreeResponse: userId,
                    opFourResponse: userId,
                    opFiveResponse: userId,
                    totalResponse: userId
                }
            }, {
                new: true
            }).select('opOneResponse opTwoResponse opThreeResponse opFourResponse opFiveResponse')
            return {
                updated: true,
                response: data
            }
        } else {
            return {
                updated: false,
                error: "already removed"
            }
        }

    } catch (error) {
        throw error;
    }
}


PollSchema.statics.pollUpdate = async function (pollPostId, description,  opOne, opTwo, opThree, opFour, opFive, endsOn, userId) {
    try {
        postData = {
            opOne: opOne,
            opTwo: opTwo,
            opThree: opThree,
            opFour: opFour,
            opFive: opFive,
            postBy: userId,
            description: description,
            endsOn: endsOn
        }
        if (description) {
            postData.hashtags = description.match(/#[a-z]+/gi)
        }
        const finalData = _.pickBy(postData, _.identity)

        updated = await this.findOneAndUpdate({
                _id: pollPostId,
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


PollSchema.plugin(mongoosastic, {
    'host': "localhost",
    'port': 9200
})


var Poll = mongoose.model('Poll', PollSchema)

Poll.createMapping({
}, (err, mapping) => {
    if (err) {
        console.log('error creating mapping (you can safely ignore this)');
        console.log(err);
    } else {
        console.log('mapping created!');
        // console.log(mapping);
    }
});

Poll.syncIndexes()
module.exports = Poll;