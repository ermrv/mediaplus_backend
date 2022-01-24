const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var data = new Schema({
//     mimetype: String,
//     path: String,
//     size: Number,
// })



const Message = new Schema({
    message: {
        type: Schema.Types.Mixed
    },
    // type: {
    //     type: String,
    //     enum: ['TEXT', 'PIC'],
    //     default: 'TEXT'
    // },
    byUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // content: [data]

}, {timestamps: true})

var chatMessage = mongoose.model('Message', Message)


const ContestThreadSchema = new mongoose.Schema({

    chatUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    organiser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: String,
    
    messages: [Message],

}, { timestamps: true })
var ContestThread = mongoose.model('ContestThread', ContestThreadSchema)
module.exports = ContestThread;