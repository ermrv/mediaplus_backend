const mongoose = require('mongoose');
var Schema = mongoose.Schema;


const ContestRequestSchema = new mongoose.Schema({
    contest: {
        type: Schema.Types.ObjectId,
        ref: 'Contest'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reason: String,
    status: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })
var ContestRequest = mongoose.model('ContestRequest', ContestRequestSchema)
module.exports = ContestRequest;