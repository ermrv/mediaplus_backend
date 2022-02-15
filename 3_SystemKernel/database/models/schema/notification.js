const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var admin = require("firebase-admin");

var serviceAccount = require('../../../fcm/mediaplus-cedc1-firebase-adminsdk-3i5n5-3b2b09c004.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mediaplus-cedc1-default-rtdb.firebaseio.com/"
});

const NotificationSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    notificationType: {
        type: String,
        enum: ['like', 'comment', 'share', 'follow', 'commentLike'],
    },
    followed: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    notificationString: {
        type: String
    },
    notificationTo: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    notificationGreoup: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]

}, { timestamps: true })


NotificationSchema.statics.createNotification = async function (userId, notificationType, followed, postId, commentId) {
    try {
        const data = {
            user: userId,
            notificationType: notificationType,
            followed: followed,
            postId: postId,
            commentId: commentId,
        }
        if (notificationType == "like") {
            notificationString = "someone liked your post"

            data['notificationString'] = notificationString
        }
        if (notificationType == "comment") {
            notificationString = "someone commented on your post"

            data['notificationString'] = notificationString
        }
        if (notificationType == "share") {
            notificationString = "someone shared your post"
            data['notificationString'] = notificationString
        }
        if (notificationType == "follow") {
            notificationString = "someone followed you"


            data['notificationString'] = notificationString
        }
        if (notificationType == "commentLike") {
            notificationString = "someone liked your comment"

            data['notificationString'] = notificationString
        }

        createNotification = await this.create(data)
        const User = require('./user')
        user = await User.findById(userId)

        var fcmToken = user.fcmToken
        var message = {
            // to: fcmToken,
            // priority: "high",
            notification: {
                title: notificationType,
                body: notificationString
            },
            topic: "extra"
        };
        // Send a message to subscribed user
        sendMe = await admin.messaging().send(message)
        // res.status(200).json({
        //     sent: true,
        //     notification: sendMe
        // })

        return sendMe;
    } catch (error) {
        throw error;
    }
}


var Notification = mongoose.model('Notification', NotificationSchema)
module.exports = Notification;

