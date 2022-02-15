var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var boxContentSchema = new Schema({
    contents: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    title: {
        type: String,
    },

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    contentType: String,
    posterImage: String,
    posterLink: String
})

var boxSchema = new Schema({
    viewType: String,
    boxContents: boxContentSchema
});

var ContentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    contentType: String,
    boxes: [boxSchema]
}, { timestamps: true });


//controller functions
ContentSchema.statics.initialiseUser = async function (userId) {
    try {
        console.log("New User registered with userId: " + userId)

        // create personalized Newsfeed 
        newsfeed = await this.create({
            userId: userId,
            contentType: "userNewsfeed",
            boxes: [{
                viewType: "userStatus",
                boxContents: {
                    status: [],
                    contentType: "status"
                }
            }, {
                viewType: "userPosts",
                boxContents: {
                    contents: [],
                    contentType: "newsfeedPosts"
                }
            }]
        })

        // create homepage videos
        homeVideos = await this.create({
            userId: userId,
            contentType: "userHomeVideos",
            boxes: [{
                viewType: "videoReference",
                boxContents: {
                    contents: [],
                    title: "New Videos",
                    contentType: "videos"
                }
            }, {
                viewType: "videoReference",
                boxContents: {
                    contents: [],
                    title: "Short Videos",
                    contentType: "videos"
                }
            }, {
                viewType: "videoReference",
                boxContents: {
                    contents: [],
                    title: "Trending Videos",
                    contentType: "videos"
                }
            }, {
                viewType: "videoReference",
                boxContents: {
                    contents: [],
                    title: "Favourite Videos",
                    contentType: "videos"
                }
            }, {
                viewType: "videoReference",
                boxContents: {
                    contents: [],
                    title: "You may watch.",
                    contentType: "videos"
                }
            },]
        })

        // create nearyouthings
        nearYou = await this.create({
            userId: userId,
            contentType: "homepageNearYou",
            boxes: [{
                viewType: "videoReference",
                boxContents: {
                    contents: [],
                    title: "Short Videos",
                    contentType: "videos"
                }
            }, {
                viewType: "videoReference",
                boxContents: {
                    contents: [],
                    title: "Long Videos",
                    contentType: "videos"
                }
            }, {
                viewType: "nearbyPeopleReference",
                boxContents: {
                    users: [],
                    title: "People near you",
                    contentType: "user"
                }
            }, {
                viewType: "nearbyContestReference",
                boxContents: {
                    contents: [],
                    title: "contests near you",
                    contentType: "contest"
                }
            }, {
                viewType: "videoReference",
                boxContents: {
                    contents: [],
                    title: "Today's special near you",
                    contentType: "videos"
                }
            }]
        })

        // // explore homepage
        // homeExplore = await this.create({
        //     userId: userId,
        //     contentType: "homepageExplore",
        //     boxes: [{
        //         viewType: "imagePostReference",
        //         boxContents: {
        //             contents: [],
        //             title: "Top Pics",
        //             contentType: "imagepost"
        //         }
        //     }, {
        //         viewType: "contestReference",
        //         boxContents: {
        //             contents: [],
        //             title: "People near you",
        //             contentType: "contest"
        //         }
        //     }, {
        //         viewType: "videoPostReference",
        //         boxContents: {
        //             contents: [],
        //             title: "People near you",
        //             contentType: "videoPost"
        //         }
        //     },{
        //         viewType: "eventsReference",
        //         boxContents: {
        //             contents: [],
        //             title: "contests near you",
        //             contentType: "event"
        //         }
        //     }, {
        //         viewType: "userReference",
        //         boxContents: {
        //             users: [],
        //             title: "Today's special near you",
        //             contentType: "users"
        //         }
        //     }]
        // })

        //homepageRewards
        homeRewards = await this.create({
            userId: userId,
            contentType: "homepageRewards",
            boxes: [{
                viewType: "rewards",
                boxContents: {
                    contents: [],
                    title: "Top Rewards",
                    contentType: "rewards"
                }
            }]
        })

        // homepageContests
        homeContests = await this.create({
            userId: userId,
            contentType: "homepageContests",
            boxes: [{
                viewType: "contests",
                boxContents: {
                    contents: [],
                    title: "Contests to play",
                    contentType: "contests"
                }
            }]
        })

        console.log("All content schema successfully initialised.")

    } catch (error) {
        throw error;
    }
}

//Post update to user Newsfeed
ContentSchema.statics.addToSelfNewsFeedContent = async function (userId, postId) {
    try {
        data = await this.updateOne(
            {
                userId: userId,
                contentType: "userNewsfeed",
                'boxes.viewType': "userPosts"
            }, {
            $addToSet: {
                'boxes.$.boxContents.contents': postId
            }
        })
        return data;
    } catch (error) {
        throw error;
    }
}

//Post update to all users
//update videos homepage: userHomeVideos
ContentSchema.statics.addToEveryProfileShortVideos = async function (postId) {
    try {
        var vidTitle = ["New Videos", "Short Videos", "Trending Videos", "Favourite Videos", "You may watch."]
        for (let i = 0; i < 5; i++) {
            data = await this.updateMany({
                contentType: "userHomeVideos",
                // 'boxes.viewType': "videoReference",
                "boxes.boxContents.title": vidTitle[i]
            }, {
                $addToSet: {
                    'boxes.$.boxContents.contents': postId,
                },
            })
        }
        return data;
    } catch (error) {
        throw error;
    }
}

//update homepageNearYou
ContentSchema.statics.addToEveryProfileHomePageNearYou = async function (postId) {
    try {
        var nearYou = ["Short Videos", "Long Videos"]
        for (let i = 0; i < 2; i++) {
            data = await this.updateMany(
                {
                    contentType: "homepageNearYou",
                    // 'boxes.viewType': "videoReference",
                    "boxes.boxContents.title": nearYou[i]
                }, {
                $addToSet: {
                    'boxes.$.boxContents.contents': postId,
                },
            })
        }
        return data;
    } catch (error) {
        throw error;
    }
}

//update homepageExplore
ContentSchema.statics.addToEveryProfileHomePageExplore = async function (postId) {
    try {
      var explore = ["Short Videos", "Long Videos", "Today's special near you"]
      for (let i = 0; i < 3; i++) {
        data = await this.updateMany(
          {
            contentType: "homepageExplore",
            // 'boxes.viewType': "videoReference",
            "boxes.boxContents.title": explore[i]
          }, {
          $addToSet: {
            'boxes.$.boxContents.contents': postId,
          },
        })
      }
        return data;
    } catch (error) {
        throw error;
    }
}




var Content = mongoose.model("Content", ContentSchema);
module.exports = Content;
