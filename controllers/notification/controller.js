//.........................ALL Imports............................
const db = require('../../database/models');
require('dotenv').config()
var _ = require('lodash');
// var admin = require("firebase-admin");

// var serviceAccount = require('./../../fcm/mediaplus-cedc1-firebase-adminsdk-3i5n5-3b2b09c004.json');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://mediaplus-cedc1-default-rtdb.firebaseio.com/"
// });



//....................ALL Notification Page Routes.......................


exports.notifications = async (req, res) => {
    try {
        notifications  = await db.notification.find({user: req.userData.userId})
        .populate('user', 'username _id profilePic name')

        res.status(200).json(notifications)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


// exports.sendNotification = async (req, res) => {
//     try {
//         var topic = 'general';
//         var message = {
//             notification: {
//                 title: 'Message',
//                 body: 'You have 3 friends nearby.!'
//             },
//             topic: topic
//         };
//         // Send a message to devices subscribed to the provided topic.
//         sendMe = await admin.messaging().send(message)
//         res.status(200).json({
//             sent: true,
//             notification: sendMe
//         })
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// }
