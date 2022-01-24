module.exports = {
    user: require("./schema/user"),


    content: require("./schema/content"),
    

    // Types of posts schema
    post: require('./schema/post/post'),
    imagepost: require("./schema/post/imagepost"),
    videopost: require("./schema/post/videopost"),
    textpost: require("./schema/post/textpost"),
   
    pollpost: require("./schema/post/poll"),
   



    comment: require("./schema/comment"),

    userlog: require('./schema/userlog'),

    promotion: require('./schema/promotion'),

    postview: require('./schema/postview'),

    tag: require('./schema/tag'),

    notification: require('./schema/notification'),

  };