//....................ALL Imports.......................
const db = require('../../database/models');
var _ = require('lodash');

//....................ALL Reaction Page Routes.......................

// Post
exports.addPostReaction = async (req, res) => {
    try {
        const { postId, reaction } = req.body
        if (!postId || !reaction) {
            res.status(400).json({ error: "postId or reaction error!" })
        }
        if (reaction != "nice" && reaction != "love" && reaction != "cool" && reaction != "haha" && reaction != "wow") {
            res.status(400).json({ error: "Reaction type doesn't exist!" })
        }
        else {
            postData = await db.post.findById(postId)
            if (postData) {

                reactionData = await db.reaction.findOne({ postId: postId, userId: req.userData.userId })
                //checking reaction exist or not 
                if (reactionData) {
                    // if exist then update

                    if (reactionData.reaction == reaction) {
                        // if same reaction done // do nothing
                        res.status(200).json({ message: "Already same reaction reacted." })
                    }
                    else {
                        //if different reaction reacted then remove previously reacted data and then add new one.
                        // update post document noOfReaction and id remove and add to reaction reeacted

                        // for removing userid from initially reacted 
                        var key1 = reactionData.reaction
                        var query1 = {}
                        query1[key1] = req.userData.userId

                        //for adding userId to new reaction in post document
                        var key2 = reaction
                        var query2 = {}
                        query2[key2] = req.userData.userId

                        // for decreasing 1 from previously reacted and for increasing 1 to newReactionCount
                        var key3 = (key1).concat("ReactCount")
                        var key4 = (key2).concat("ReactCount")
                        var query3 = {}
                        query3[key3] = -1
                        query3[key4] = 1

                        updatePost = await db.post.updateOne({ _id: postId }, {
                            $pull: query1,
                            $addToSet: query2,
                            $inc: query3
                        })

                        //update reaction in reaction document of that user for that post
                        updateReaction = await db.reaction.updateOne({ _id: reactionData._id }, { $set: { reaction: reaction } })

                        //no need to change user likedPosts document
                        postDataResponse = await db.post.findById(postId, 'nice love cool haha wow niceReactCount loveReactCount coolReactCount hahaReactCount wowReactCount')
                        res.status(200).json(postDataResponse)
                    }
                }
                else {
                    // if doesn't then create new
                    // add userId to post 
                    //increase no of reaction in post

                    //for adding upserid to post reaction reactied
                    var key1 = reaction
                    var query1 = {}
                    query1[key1] = req.userData.userId

                    //for increasing 1 to noOfReaction Count 
                    var key2 = (key1).concat("ReactCount")
                    var query2 = {}
                    query2[key2] = 1

                    updatedPost = await db.post.updateOne({ _id: postId }, {
                        $addToSet: query1,
                        $inc: query2
                    })

                    //add postId to user
                    addToUser = await db.user.updateOne({ _id: req.userData.userId }, { $addToSet: { likedPosts: postId } })

                    //update in reaction table
                    const newReaction = {
                        userId: req.userData.userId,
                        postId: postId,
                        reaction, reaction
                    }
                    addReaction = await db.reaction.create(newReaction)
                    postDataResponse = await db.post.findById(postId, 'nice love cool haha wow niceReactCount loveReactCount coolReactCount hahaReactCount wowReactCount')
                    res.status(200).json(postDataResponse)
                }

            } else {
                res.status(404).json({ error: "post doesn't exist" })
            }
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.removePostReaction = async (req, res) => {
    try {
        const { postId } = req.body
        if (!postId) {
            res.status(400).json({ error: "Enter correct postId." })
        }
        else {
            postData = await db.post.findById(postId)
            if (postData) {
                //post exists
                reactionData = await db.reaction.findOne({ postId: postId, userId: req.userData.userId })
                //checking reaction exist or not 
                if (reactionData) {
                    // if exist then remove

                        // for removing userid from reacted 
                        var key1 = reactionData.reaction
                        var query1 = {}
                        query1[key1] = req.userData.userId

                        // for decreasing 1 from reactionCount 
                        var key2 = (key1).concat("ReactCount")
                        var query2 = {}
                        query2[key2] = -1


                        updatePost = await db.post.updateOne({ _id: postId }, {
                            $pull: query1,
                            $inc: query2
                        })

                        //remove reaction document of that user for that post
                        updateReaction = await db.reaction.findByIdAndDelete(reactionData._id)

                        //remove liked post from user document 
                        updateUser = await db.user.updateOne({ _id: req.userData.userId }, { $pull: { likedPosts: postId }})

                        postDataResponse = await db.post.findById(postId, 'nice love cool haha wow niceReactCount loveReactCount coolReactCount hahaReactCount wowReactCount')
                        res.status(200).json(postDataResponse)
                    
                }
                else{
                    //reaction not added by user on that post
                    res.status(200).json({message: "reaction doesn't exist."})
                }
            } else {
                //post doesn't exist
                res.status(404).json({ error: "post doesn't exist" })
            }
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.allPostReaction = async (req, res) => {
    try {
        const { postId } = req.body
        if (!postId) {
            res.status(400).json({ error: "Enter correct postId." })
        }
        else {
            postDataResponse = await db.post.findById(postId, 'nice love cool haha wow niceReactCount loveReactCount coolReactCount hahaReactCount wowReactCount')
                .populate('nice', 'username _id profilePic name')
                .populate('love', 'username _id profilePic name')
                .populate('cool', 'username _id profilePic name')
                .populate('haha', 'username _id profilePic name')
                .populate('wow', 'username _id profilePic name')

            if (postDataResponse) {
                res.status(200).json(postDataResponse)
            } else {
                res.status(404).json({ error: "post doesn't exist" })
            }
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


// Status 
exports.addStatusReaction = async (req, res) => {
    try {


        res.status(200).json()
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.removeStatusReaction = async (req, res) => {
    try {

        res.status(200).json()
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.allStatusReaction = async (req, res) => {
    try {


        res.status(200).json()
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


// Highlights
exports.addHighlightsReaction = async (req, res) => {
    try {


        res.status(200).json()
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.removeHighlightsReaction = async (req, res) => {
    try {


        res.status(200).json()
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.allHighlightsReaction = async (req, res) => {
    try {


        res.status(200).json()
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
