const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const {
    getVideoDurationInSeconds
} = require('get-video-duration');
const mongoosastic = require('mongoosastic')
const path = require('path');
const http = require("http");

const data = new Schema({
    mimetype: {
        type: String,
        enum: ['video/mp4', 'video/webm'],
        required: true,
    },
    path: {
        type: String,
        trim: true
    },
    size: Number,
    thumbnail: String,
    shortVideoPath: String,
})

// At present, this schema is valid for only one video in a post. To modify it for many numbers,(two fields : shortVideo, videoDuration to be moved in data for each diffent video)


const VideoPostSchema = new mongoose.Schema({

    postContent: [data],
    aspectRatio: String,
    templateType: String,
    location: String,

    shortVideo: {
        type: Boolean,
        default: false
    },
    videoDuration: {
        type: String,
        required: true
    },

    postBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    mentions: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    oldDescription: String,
    description: String,
    hashtags: [String],


}, {
    timestamps: true
})

//controller functions
VideoPostSchema.statics.createVideoPost = async function (description, mentions, aspectRatio, templateType, location, req) {
    try {

        var fileDetails = [];
        //do file operation in each
        for (var f of req.files) {
            var e = {};
            e.mimetype = f.mimetype
            e.path = "/posts/".concat(f.filename)
            e.size = f.size
            e.thumbnail = "/thumbnail/".concat(path.parse(f.filename).name).concat("_thumbnail.jpg")
            e.shortVideoPath = "/shortvideo/".concat("shortvideo_").concat(f.filename)
            fileDetails.push(e);
        }

        //extracting thumbnail
        url = "http://localhost:8000/thumbnail?filename=".concat(req.files[0].filename)
        console.log(url)

        addThumbnail = await http.get(url, res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
                body += data;
            });
            res.on("end", () => {
                body = JSON.parse(body);
                console.log(body);
            });
        });


        const duration = await getVideoDurationInSeconds(req.files[0].path)

        postData = {
            postContent: fileDetails,
            aspectRatio: aspectRatio,
            templateType: templateType,
            location: location,
            videoDuration: duration,
            postBy: req.userData.userId,
            description: description,
            mentions: mentions
        }
        if (description) {
            postData.hashtags = description.match(/#[a-z]+/gi)
        }

        //process for short video 
        if (duration < 30) {
            postData.shortVideo = true
        } 
        else {
            //extracting short video from long video 
            url = "http://localhost:8000/videocut?filename=".concat(req.files[0].filename)
            console.log(url)

            addThumbnail = await http.get(url, res => {
                res.setEncoding("utf8");
                let body = "";
                res.on("data", data => {
                    body += data;
                });
                res.on("end", () => {
                    body = JSON.parse(body);
                    console.log(body);
                });
            });
        }

        newVideoPost = await this.create(postData)

        return newVideoPost;
    } catch (error) {
        throw error;
    }
}

VideoPostSchema.updateVideoPost = async function (thumbnail) {
    try {



        return data;
    } catch (error) {
        throw error;
    }
}

VideoPostSchema.plugin(mongoosastic, {
    'host': "localhost",
    'port': 9200
})


var VideoPost = mongoose.model('VideoPost', VideoPostSchema)

VideoPost.createMapping({
}, (err, mapping) => {
    if (err) {
        console.log('error creating mapping (you can safely ignore this)');
        console.log(err);
    } else {
        console.log('mapping created!');
    }
});

VideoPost.syncIndexes()

module.exports = VideoPost;