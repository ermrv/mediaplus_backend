const express = require('express');
const router = express.Router();
const checkAuth = require('./../3_SystemKernel/middleware/check-auth');

// Controller import
const index_controller = require('../2_Modules/controller');
const user_controller = require('../2_Modules/user/controller');
const status_controller = require('../2_Modules/status/controller');
const highlights_controller = require('../2_Modules/highlights/controller');
const message_controller = require('../2_Modules/message/controller');
const reaction_controller = require('../2_Modules/reaction/controller');
const comment_controller = require('../2_Modules/comment/controller');
const photo_controller = require('../2_Modules/photo/controller');
const promotion_controller = require('../2_Modules/promotion/controller');
const notification_controller = require('../2_Modules/notification/controller')
const delete_controller = require('../2_Modules/delete/controller')

//post controllers
const post_controller = require('../2_Modules/post/controller');
const textPost_controller = require('../2_Modules/post/textpost/controller');
const imagePost_controller = require('../2_Modules/post/imagepost/controller');
const videoPost_controller = require('../2_Modules/post/videopost/controller');
// const contest_controller = require('../src/post/contest/controller');
const poll_controller = require('../2_Modules/post/poll/controller');
// const event_controller = require('../src/post/event/controller');



const upload = require('./../3_SystemKernel/middleware/uploader/upload');

//....................ALL Index Page Routes.......................
router.post('/database/clear', delete_controller.clearDatabase);        // secret == ManirajVats@1324

router.post('/test', index_controller.test)


// ......User case 1 Authenticate user
router.post('/user/add', user_controller.addUser);
router.post('/user/changepassword', checkAuth, user_controller.changePassword);                            //  (password, newPassword)
router.post('/user/passlogin', user_controller.passLogin)                                                 //(mobile/email, password)
router.post('/user/register', checkAuth, user_controller.register);                                      // name, password, email, username, birthday, gender, location, bio

router.post('/newsfeed/trending', checkAuth, index_controller.newsfeedTrending)


// ......User case 2 Add post
// Adding Post controller ( In this operation is done in poll schema and its content(textpost, imagepost, videopost, ... ) schema )
router.post('/textpost/add', checkAuth, textPost_controller.addNewPost);                                 // description, postLocation
router.post('/imagepost/add', checkAuth, upload.post, imagePost_controller.addNewPost);                 // postFile(array)( 1-5 images) , description, aspectRatio, templateType, postLocation, location
router.post('/videopost/add', checkAuth, upload.post, videoPost_controller.addNewPost);                // postFile(array)( 1 video ) , description, aspectRatio, templateType, postLocation, location
// router.post('/contestpost/add', checkAuth, upload.contestPoster, contest_controller.addNewContest);   // description, aspectRatio, templateType, postLocation, location
router.post('/pollpost/add', checkAuth, poll_controller.addNewPost);                                 // description, aspectRatio, templateType, postLocation, location
// router.post('/eventpost/add', checkAuth, upload.eventPoster, event_controller.addNewPost);          // description, aspectRatio, templateType, postLocation, location


// ......User case 3A  Edit post
// poll controller
router.post('/pollpost/react', checkAuth, poll_controller.reactPoll);                                   // pollPostId, optionChoice
router.post('/pollpost/update', checkAuth, poll_controller.updatePoll);                                // pollPostId, description, opOne, opTwo, opThree, opFour, opFive, endsOn

// router.post('/post/add', checkAuth, upload.post, post_controller.addPost);                                  // postFile(array) , postContentType, description, aspectRatio, templateType, location

router.post('/post/update/thumbnail', checkAuth, upload.thumbnail, post_controller.updatethumbnail);        // (not used)   // from field upload -> postContentId, thumbnail

router.post('/notifications', checkAuth, notification_controller.notifications);                                     //email


//event controller
// router.post('/eventpost/update', checkAuth, event_controller.updateEvent);                  //eventPostId, eventName, description, startsOn, endsOn, userId


// ......User case 3B   Delete post

router.post('/post/delete', checkAuth, post_controller.deletePost);                                           // postId


// ......User case 4    Like post
router.post('/post/react', checkAuth, post_controller.postReaction);                                            // postId, like
router.post('/post/reacted', post_controller.reactedUsers);                                                    // postId



// ......User Case 6    Promote post
// promotion controller 
router.post('/checkpricing', checkAuth, promotion_controller.checkPrice);       //userReach, days
router.post('/razorpayKey', promotion_controller.razorpayKey);                   // nothing
router.post('/addpromotion', checkAuth, promotion_controller.promotePost)      //postId, userReach, days, redirectTo, redirection

router.post('/paymentorder', checkAuth, promotion_controller.paymentOrder);     // promotionId
router.post('/paymentverify', checkAuth, promotion_controller.paymentVerify);   // promotionId, razorpayPaymentId, razorpaySignature

// ......User case 8    View newsfeed
router.post('/newsfeed', checkAuth, index_controller.newsFeed);                                    // dataType, postId    (type can be latest/previous)

// .....User case 9     view explore page
router.post('/explore', checkAuth, index_controller.explore);                                     // dataType, postId     (type can be previous)
router.post('/shortvideos', checkAuth, index_controller.shortVideos);                            // dataType, postId      (type can be previous)

// ......user case 10    View notifications    
// notification controller
// router.post('/notification', notification_controller.sendNotification);

// ......User case 11     view profile
router.post('/user', checkAuth, user_controller.userProfile);                                                       // nothing for others(userId)
router.post('/otheruser', checkAuth, user_controller.otherUserProfile);                                            // userId

// Common post apis
router.post('/user/posts', checkAuth, post_controller.userPosts);                                                      // type = text/image/video
router.post('/otheruser/posts', checkAuth, post_controller.otherUserPosts);                                           // type = text/image/video, userId

// ......User case 12     Edit profile
// User controller
router.post('/appstart', checkAuth, user_controller.appStart);                                                  // fcmToken
router.post('/user/privateposts', checkAuth, user_controller.privatePosts);                                    //nothing
router.post('/user/likedposts', checkAuth, user_controller.likedPosts);                                       //nothing
// router.post('/user/recommended', checkAuth, user_controller.recommended);                                    //yet to complete
router.post('/user/settings', checkAuth, user_controller.settings);   //nothing
router.post('/user/settings/update', checkAuth, user_controller.updateSettings)                                       //securityNotification, likeNotification, commentNotification, mentionNotification, newFollowerNotification
router.post('/user/private', checkAuth, user_controller.updateAccountType)                               //accountType
// router.post('/user/notifications', checkAuth, user_controller.notifications);                              //yet to complete
router.post('/user/followings', checkAuth, user_controller.followings);                                  //nothing for others(userId)
router.post('/user/followers', checkAuth, user_controller.followers);                                    //nothing for others(userId)
router.post('/user/blocked', checkAuth, user_controller.blockedList);                                   //nothing
router.post('/user/block', checkAuth, user_controller.blockUser);                                      // userId
router.post('/user/unBlock', checkAuth, user_controller.unBlockUser);                                 // userId
router.post('/user/follow', checkAuth, user_controller.follow);                                      //userId
router.post('/user/unfollow', checkAuth, user_controller.unFollow);                                 //userId
router.post('/user/checkusername', user_controller.checkUsername);                                                //username
router.post('/user/mobileotp', user_controller.mobileOtp);                                                       // mobile
router.post('/user/verifyotp', user_controller.verifyOtp);                                                      //mobile code    (here static valid code is 112233)
router.post('/user/updateemail', checkAuth, user_controller.updateEmail);                                      // code       (here static valid code is 123456)
router.post('/user/verifyemail', checkAuth, user_controller.verifyEmail);                                     //email
router.post('/user/updateprofile', checkAuth, user_controller.updateProfile);                                // name, email, username, birthday, gender, location, bio
router.post('/user/profilepic/update', checkAuth, upload.profilePic, user_controller.profilePicUpdate);  // from field upload -> image
router.post('/user/coverpic/update', checkAuth, upload.coverPic, user_controller.coverPicUpdate);  // from field upload -> image

// ......User case 13      View post
router.post('/post/detail', checkAuth, post_controller.postDetail);                                                         // postId
router.post('/post/edit', checkAuth, post_controller.editPost);                                              // postId description
router.post('/post/share', checkAuth, post_controller.sharePost);                                           // postId sharedDescription postLocation
router.post('/post/related', checkAuth, index_controller.relatedPost);                                      // postId
router.post('/post/shared', checkAuth, post_controller.sharedPostDetails)                                   // postId


// ......User case 5    Comment on post

router.post('/post/comment/add', checkAuth, comment_controller.addPostComment);                                  // postId,comment
router.post('/post/comment/edit', checkAuth, comment_controller.editPostComment);                               // commentId,newComment

// react on comment
router.post('/comment/react', checkAuth, comment_controller.commentReaction);                                            // commentId, like
router.post('/comment/reacted', comment_controller.commentReactedUsers);                                                    // commentId

router.post('/subcomment/react', checkAuth, comment_controller.subCommentReaction);                                            // commentId, subCommentId like
router.post('/subcomment/reacted', comment_controller.subCommentReactedUsers);                                                    // commentId, subCommentId

//  ......user case 14      View comments    
// Comment controller

router.post('/post/comment/remove', checkAuth, comment_controller.removePostComment);                          // commentId
router.post('/post/comments', checkAuth, comment_controller.allPostComments);       //(with subcomments)      // postId
router.post('/post/subcomment/add', checkAuth, comment_controller.addPostSubComment);                       // commentId, subComment
router.post('/post/subcomment/edit', checkAuth, comment_controller.editPostSubComment);                    // commentId, subCommentId, newSubComment
router.post('/post/subcomment/remove', checkAuth, comment_controller.removePostSubComment);               // commentId, subCommentId

// ......user case 15       search
router.post('/search', index_controller.searchResults);                        // query, type(post, poll, contest, event, user)
router.post('/user/search', index_controller.userSearchResults);              // query
router.post('/hashtag/search', index_controller.hashtagSearchResults);       // query
router.post('/hashtag/posts', index_controller.hashtagPosts);       // hashtag

// ...... user case 18       logout

router.post('/user/loginactivity', checkAuth, user_controller.loginActivity);  // macAdress, lat, lng
router.post('/getlocation', checkAuth, user_controller.getLocation);  // lat, lng

router.post('/test', index_controller.test)













// .................................Not Implemented version 1.0.0 ............................................................



// // status comment controller
// router.post('/status/comment/add', checkAuth, comment_controller.addStatusComment);                                  // statusId,comment
// router.post('/status/comment/edit', checkAuth, comment_controller.editStatusComment);                               // commentId,newComment
// router.post('/status/comment/remove', checkAuth, comment_controller.removeStatusComment);                          // commentId
// router.post('/status/comments', checkAuth, comment_controller.allStatusComments);       //(with subcomments)      // statusId


// // ......user case 16       add status
// router.post('/status/add', checkAuth, upload.status, status_controller.addStatus);                 // from field upload -> statusFile, statusText
// router.post('/status/remove', checkAuth, status_controller.removeStatus);                         //statusId
// router.post('/status/react', checkAuth, status_controller.statusReaction);                       //statusId, contentId, like
// router.post('/status/reacted', checkAuth, status_controller.reactedUsers);                       //statusId, contentId


// // ......user case 17       view status 


// // Status controller
// router.post('/status/myhistory', checkAuth, status_controller.statusHistory);                        //nothing
// router.post('/status', checkAuth, status_controller.status);                                         // nothing












// // To modify data apis
// // photos controller
// router.post('/user/photos', checkAuth, photo_controller.photos);                                 //



// // To modify data apis
// // highlights controller
// router.post('/user/highlights/createcollection', checkAuth, highlights_controller.createCollection);                       //
// router.post('/user/highlights', checkAuth, highlights_controller.highlights);                                             //
// router.post('/user/highlights/deletecollection', checkAuth, highlights_controller.deleteCollection);                     //
// router.post('/user/highlights/addpost', checkAuth, highlights_controller.addPost);                                      //
// router.post('/user/highlights/deletepost', checkAuth, highlights_controller.deletePost);                               //







// // Message controller
// // router.post('/followlists', checkAuth, message_controller.contacts);                        //nothing
// // router.post('/chatroom/message', checkAuth, message_controller.messageTo);                 //userTo, message, chatRoomId,

// // router.post('/chatrooms', checkAuth, message_controller.chatrooms);                         //nothing
// // router.post('/chatroom/messages',checkAuth, message_controller.chatroomMessages);           //chatRoomId

// // threadAPI

// //message apis
// //starred message
// router.post('/starred/add', checkAuth, message_controller.addStarred);          //threadId, messageId
// router.post('/starred/remove', checkAuth, message_controller.removeStarred);    //messageId
// router.post('/starred', checkAuth, message_controller.starredMessages);         //nothing


// //personal
// //Message Request apis
// // in this all apis chattype needed
// router.post('/chatthreads', checkAuth, message_controller.chatThread);              // (to give chat lists with last message in it with time sorted)     //nothing
// router.post('/activechats', checkAuth, message_controller.activeChats);            // to give all active chats ids with users( to check where is message is active or not)
// //nothing
// router.post('/chatmessagereq', checkAuth, message_controller.messageReq);        //if not(then send message request) ( not seen by receiver)(you dont have ThreadId)
// // userTo, message, type(not needed now)
// router.post('/messagereq/accept', checkAuth, message_controller.acceptMessageReq);    //accept(boolean), userId
// //message sending
// router.post('/sendmessage', checkAuth, message_controller.sendMessage);             // only threadId needed and message content  //message, forwarded(bool), deleted(bool)
// router.post('/message/delete', checkAuth, message_controller.deleteMessage)        //  threadId, messageId
// router.post('/messages', checkAuth, message_controller.messages);                 // messages(20) with pagination threadid is needed  //threadId, page


// //group
// //chat ype need(group)
// router.post('/group/create', checkAuth, message_controller.createGroup);        // memebers to add, minimum in group(2) //threadId, groupName, description, users(array)
// //all api work on thread
// router.post('/group/edit', checkAuth, message_controller.groupEdit);                             //threadId, groupName, groupDescription
// router.post('/group/delete', checkAuth, message_controller.groupDelete);                        //threadId
// router.post('/group/member/add', checkAuth, message_controller.groupAddMember);                //threadId, userId
// router.post('/group/member/remove', checkAuth, message_controller.groupRemoveMember);         //threadId, userId
// router.post('/group/admin/add', checkAuth, message_controller.groupMakeAdmin);               //threadId, userId
// router.post('/group/admin/remove', checkAuth, message_controller.groupRemoveAdmin);         //threadId, userId
// router.post('/group/leave', checkAuth, message_controller.groupLeave);                     //threadId 


// // contest chatapp model
// // user can send only msg to contest organisers 
// // organisers can communicate to users through group chat

// // any user can host his contest 
// // user and organiser can send msg to head admins 

// // contest creation( time upto ) result , chat system 
// // every contest have one chat system
// // in which participants can chat with organiser and send their post 

// // contest creation

// //in this thread will be created and contest will br created 
// // router.post('/contest/add', checkAuth, upload.contestPoster, contest_controller.createContest);             //  poster, contestName, description, contestRules, coins, endsOn

// router.post('/contest/addposter', checkAuth, upload.contestPoster, contest_controller.addPoster);          // poster(single) , contestId

// // added user in thread
// router.post('/contest/participate/post', checkAuth, upload.post, contest_controller.addContestPost)      // postFile(array) , postContentType, description, aspectRatio, templateType, location
// // show all contest organised 
// router.post('/contests/organised', checkAuth, contest_controller.organisedContests);                  //nothing

// //show all participated contest 
// router.post('/contests/participated', checkAuth, contest_controller.participatedContest);           //nothing

// //contest posts 
// router.post('/contest/posts', contest_controller.contestPosts);                                   // contestId

// // remove post by owner
// router.post('/contest/post/remove', contest_controller.ownerContestPostRemove);

// //contest remove request
// router.post('/contest/removerequest', checkAuth, contest_controller.contestRemoveReq);          // contestId, reason

// // remove requests lists   // remove user from chatthread
// router.post('/contest/removerequests', checkAuth, contest_controller.contestRemoveRequestList)             // nothing

// //remove participation
// router.post('/contest/participate/remove', checkAuth, contest_controller.removeParticipation);          // contestId, postId

// //like/unlike remove contest
// router.post('/contest/reaction', checkAuth, contest_controller.contestReaction);   // contestId, reaction(0,1,2) 0 for no reaction or remove and 1 for like and 2 for dislike 

// //like/unlike users list 
// router.post('/contest/reactions', contest_controller.reactions);                // contestId

// // messaging part 
// //contests thread
// router.post('/contest/thread', checkAuth, contest_controller.contestThread);// threadId

// router.post('/contest/thread/message', checkAuth, contest_controller.sendMessage);                          // threadId , message

// // only organiser can change it 
// router.post('/contest/thread/description', checkAuth, contest_controller.setThreadDescription);          // threadId , description

// // report any message
// router.post('/contest/message/report', checkAuth, contest_controller.reportMessage);                  //messageId, threadId, reason

// // // Reaction Controller
// // router.post('/post/reaction/add', checkAuth, reaction_controller.addPostReaction);                                 // postId reaction
// // router.post('/post/reaction/remove', checkAuth, reaction_controller.removePostReaction);                          // postId
// // router.post('/post/reactions', checkAuth, reaction_controller.allPostReaction);          // (details)            // postId

// // router.post('/highlights/reaction/add', checkAuth, reaction_controller.addHighlightsReaction);                 //
// // router.post('/highlights/reaction/remove', checkAuth, reaction_controller.removeHighlightsReaction);          //
// // router.post('/highlights/reactions', checkAuth, reaction_controller.allHighlightsReaction);                  //

// // router.post('/status/reaction/add', checkAuth, reaction_controller.addStatusReaction);                     //
// // router.post('/status/reaction/remove', checkAuth, reaction_controller.removeStatusReaction);              //
// // router.post('/status/reactions', checkAuth, reaction_controller.allStatusReaction);                      //


module.exports = router;
