const mongoose = require('mongoose');
var Schema = mongoose.Schema;


const ChatReportSchema = new mongoose.Schema({
    threadId: {
        type: Schema.Types.ObjectId,
        ref: 'ContestThread'
    },
    messageId: {
        type: Schema.Types.ObjectId,
        ref: 'ContestThread.Message',
    },
    byUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reason: String,
    resolved: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })
var ChatReport = mongoose.model('ChatReport', ChatReportSchema)
module.exports = ChatReport;