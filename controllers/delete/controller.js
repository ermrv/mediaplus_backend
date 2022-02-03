//.........................ALL Imports............................
const db = require('../../database/models');
const Poll = require('../../database/models/schema/post/pollpost');



// all routes

exports.clearDatabase = async (req, res) => {
    try {
        if(req.body.secret == "Mayank@9097"){

        user = await db.user.deleteMany({})

        post = await db.post.deleteMany({})

        textpost = await db.textpost.deleteMany({})

        imagepost = await db.imagepost.deleteMany({})

        videopost = await db.videopost.deleteMany({})

        contest = await db.contest.deleteMany({})

        Poll = await db.pollpost.deleteMany({})

        event = await db.eventpost.deleteMany({})

        chatreport = await db.chatreport.deleteMany({})

        chatthread = await db.chatthread.deleteMany({})

        contestrequest = await db.contestrequest.deleteMany({})

        contestthread = await db.contestthread.deleteMany({})

        notification = await db.notification.deleteMany({})

        status = await db.status.deleteMany({})

        tag = await db.tag.deleteMany({})

        userlog = await db.userlog.deleteMany({})

        promotion = await db.promotion.deleteMany({})

        content = await db.content.deleteMany({})

        comment = await db.comment.deleteMany({})

        updatPostview = await db.postview.updateOne({ _id: "613b26eae8548fc8339af207" },
            {
                $set: {
                    shortVideos: [],
                    allPosts: []

                }
            })

            res.status(200).json({ message: "Data cleared"})
        }else{
            res.status(404).json({message: "You are not authorised.!"})
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


