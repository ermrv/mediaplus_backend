//....................ALL Imports.......................
const db = require('../../models');
require('dotenv').config()
var _ = require('lodash');


//....................ALL Highlights Page Routes.......................

exports.highlights = async (req, res) => {
    try {
        const response = await db.user.findOne({ _id: req.userData.userId }, 'highlights')
            .populate('highlights.posts', '')
        res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.createCollection = async (req, res) => {
    try {
        const { collectionName } = req.body
        const checkRepeat = await db.user.findOne({ _id: req.userData.userId, 'highlights.collectionName': collectionName }, 'highlights')

        if (checkRepeat) {
            res.status(200).json({ collectionExist: true })
        } else {
            const response = await db.user.updateOne({ _id: req.userData.userId }, { $addToSet: { highlights: [{ collectionName: collectionName }] } })
            const userHighlights = await db.user.findOne({ _id: req.userData.userId }, 'highlights')

            res.status(200).json({
                collectionCreated: true,
                highlights: userHighlights
            })
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.deleteCollection = async (req, res) => {
    try {
        const { highlightsId } = req.body
        const response = await db.user.findOneAndUpdate(
            { _id: req.userData.userId },
            { $pull: { highlights: { _id: highlightsId } } })
        const userHighlights = await db.user.findOne({ _id: req.userData.userId }, 'highlights')

        res.status(200).json({
            collectionDeleted: true,
            highlights: userHighlights,
        })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.addPost = async (req, res) => {
    try {
        const { highlightsId, postId } = req.body
        const checkRepeat = await db.user.findOne({ _id: req.userData.userId, 'highlights._id': highlightsId }, 'highlights')

        if (checkRepeat) {

            const response = await db.user.updateOne({
                _id: req.userData.userId,
                'highlights._id': highlightsId
            }, {
                $addToSet: {
                    'highlights.$.posts': postId
                }
            })
            const userHighlights = await db.user
                .findOne({ _id: req.userData.userId }, 'highlights')
            // .populate('highlights.posts','')


            res.status(200).json({
                postAdded: true,
                highlights: userHighlights
            })
        } else {
            res.status(200).json({ collectionExist: false })
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.deletePost = async (req, res) => {
    try {
        const { highlightsId, postId } = req.body
        const checkRepeat = await db.user.findOne({ _id: req.userData.userId, 'highlights._id': highlightsId }, 'highlights')

        if (checkRepeat) {

            const response = await db.user.updateOne({ _id: req.userData.userId, 'highlights._id': highlightsId }, { $pull: { 'highlights.$.posts': postId } })
            const userHighlights = await db.user.findOne({ _id: req.userData.userId }, 'highlights')
            // .populate('highlights.posts','')


            res.status(200).json({
                postDeleted: true,
                highlights: userHighlights
            })
        } else {
            res.status(200).json({ collectionExist: false })
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
