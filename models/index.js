module.exports = {
    user: require("./schema/user"),
    status: require("./schema/status"),


    content: require("./schema/content"),
    

    // Types of posts schema
    post: require('./schema/post/post'),
    imagepost: require("./schema/post/imagepost"),
    videopost: require("./schema/post/videopost"),
    textpost: require("./schema/post/textpost"),
    contest: require("./schema/post/contest"),
    pollpost: require("./schema/post/poll"),
    eventpost: require("./schema/post/event"),



    comment: require("./schema/comment"),

    chatthread: require("./schema/chatthread"),

    contestthread: require("./schema/contestthread"),

    contestrequest: require('./schema/contestrequest'),

    chatreport: require('./schema/chatreport'),
    
    userlog: require('./schema/userlog'),
    
    promotion: require('./schema/promotion'),

    postview: require('./schema/postview'),

    tag: require('./schema/tag'),

    notification: require('./schema/notification'),

  };