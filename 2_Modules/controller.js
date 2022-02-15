//....................ALL Imports.......................
const db = require('../3_SystemKernel/database/models');
require('dotenv').config()
var _ = require('lodash');
const elasticsearch = require("elasticsearch")

const esClient = elasticsearch.Client({
  host: "http://127.0.0.1:9200",
})

//....................ALL Index Page Routes.......................

exports.test = async (req, res) => {
  try {
    data = await db.user.find()

    for (let j = 0; j < data.length; j++) {
      post = data[j].newsfeedPosts

      for (let i = 0; i < post.length; i++) {

        ab = await db.post.findById(post[i])
        if (!ab) {
          console.log("deleted")
          pullData = await db.user.findOneAndUpdate({
            _id: data[j]
          }, {
            $pull: {
              newsfeedPosts: post[i]
            }
          }, {
            new: true
          })
        }


        // console.log(data[j].post[i].newsfeedPosts.length)

      }
    }


  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}


exports.userSearchResults = async (req, res) => {
  try {
    const {
      query
    } = req.body
    if (!query) {
      res.status(400).json({
        error: "Enter search string.!"
      })
    } else {
      response = {}
      response['query'] = query

      elasticResponse = await esClient.search({
        index: ["users"],
        q: `*${query}*`,
        size: 100
      })

      userIds = []
      for (let i = 0; i < elasticResponse.hits.hits.length; i++) {
        userIds.push(elasticResponse.hits.hits[i]._id)
      }
      userResponse = await db.user.userArrayDetails(userIds)

      response['count'] = elasticResponse.hits.hits.length
      response['search-results'] = userResponse


      res.status(200).json(response)
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}

exports.hashtagSearchResults = async (req, res) => {
  try {
    const {
      query
    } = req.body
    if (!query) {
      res.status(400).json({
        error: "Enter search string.!"
      })
    } else {
      response = {}
      response['query'] = query

      elasticResponse = await esClient.search({
        index: ["tags"],
        q: `*${query}*`,
        size: 100
      })

      response = []
      for (let i = 0; i < elasticResponse.hits.hits.length; i++) {
        data = {
          hashtag: elasticResponse.hits.hits[i]._source.hashtag,
          count: elasticResponse.hits.hits[i]._source.count
        }
        response.push(data)
      }

      response['count'] = elasticResponse.hits.hits.length
      response['search-results'] = response

      res.status(200).json(response)
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}


exports.hashtagPosts = async (req, res) => {
  try {
    const {
      hashtag
    } = req.body
    hashtagData = await db.tag.findOne({
      hashtag: hashtag
    })

    postIds = hashtagData.posts

    postResponse = await db.post.arrayPostDetail(postIds)
    res.status(200).json(postResponse)

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}


exports.searchResults = async (req, res) => {
  try {
    const {
      query,
      type
    } = req.body
    if (!query) {
      res.status(400).json({
        error: "Enter search string.!"
      })
    } else {
      response = {}
      response['query'] = query
      response['type'] = type

      if (type == "user") {

        elasticResponse = await esClient.search({
          index: ["users"],
          q: `*${query}*`,
          size: 100
        })

        userIds = []
        for (let i = 0; i < elasticResponse.hits.hits.length; i++) {
          userIds.push(elasticResponse.hits.hits[i]._id)
        }
        userResponse = await db.user.userArrayDetails(userIds)

        response['count'] = elasticResponse.hits.hits.length
        response['search-results'] = userResponse

      } else if (type == "post") {

        elasticResponse = await esClient.search({
          index: ["textposts", "videoposts", "imageposts"],
          q: `*${query}*`,
          size: 100
        })
        postIds = []
        for (let i = 0; i < elasticResponse.hits.hits.length; i++) {
          postIds.push(elasticResponse.hits.hits[i]._id)
        }
        postResponse = await db.post.arrayPostDetail(postIds)
        response['count'] = elasticResponse.hits.hits.length
        response['search-results'] = postResponse

      } else if (type == "hashtag") {

        elasticResponse = await esClient.search({
          index: ["tags"],
          q: `*${query}*`,
          size: 100
        })

        hashtagResponse = []
        for (let i = 0; i < elasticResponse.hits.hits.length; i++) {
          data = {
            hashtag: elasticResponse.hits.hits[i]._source.hashtag,
            count: elasticResponse.hits.hits[i]._source.count
          }
          hashtagResponse.push(data)
        }

        response['count'] = elasticResponse.hits.hits.length
        response['search-results'] = hashtagResponse


      } else if (type == "contest") {
        elasticResponse = await esClient.search({
          index: ["contests"],
          q: `*${query}*`,
          size: 100
        })
        postIds = []
        for (let i = 0; i < elasticResponse.hits.hits.length; i++) {
          postIds.push(elasticResponse.hits.hits[i]._id)
        }
        postResponse = await db.post.arrayPostDetail(postIds)
        response['count'] = elasticResponse.hits.hits.length
        response['search-results'] = postResponse

      } else if (type == "poll") {

        elasticResponse = await esClient.search({
          index: ["polls"],
          q: `*${query}*`,
          size: 100
        })
        postIds = []
        for (let i = 0; i < elasticResponse.hits.hits.length; i++) {
          postIds.push(elasticResponse.hits.hits[i]._id)
        }
        postResponse = await db.post.arrayPostDetail(postIds)

        response['count'] = elasticResponse.hits.hits.length
        response['search-results'] = postResponse

      } else if (type == "event") {

        elasticResponse = await esClient.search({
          index: ["events"],
          q: `*${query}*`,
          size: 100
        })
        postIds = []
        for (let i = 0; i < elasticResponse.hits.hits.length; i++) {
          postIds.push(elasticResponse.hits.hits[i]._id)
        }
        postResponse = await db.post.arrayPostDetail(postIds)

        response['count'] = elasticResponse.hits.hits.length
        response['search-results'] = postResponse

      } else {

        elasticResponseUser = await esClient.search({
          index: ["users"],
          q: `*${query}*`,
          size: 100
        })

        userIds = []
        for (let i = 0; i < elasticResponseUser.hits.hits.length; i++) {
          userIds.push(elasticResponseUser.hits.hits[i]._id)
        }
        userResponse = await db.user.userArrayDetails(userIds)


        elasticResponse = await esClient.search({
          index: ["textposts", "videoposts", "imageposts", "polls", "events", "contests"],
          q: `*${query}*`,
          size: 100
        })
        postIds = []
        for (let i = 0; i < elasticResponse.hits.hits.length; i++) {
          postIds.push(elasticResponse.hits.hits[i]._id)
        }
        postResponse = await db.post.arrayPostDetail(postIds)

        response['count'] = userResponse.length + elasticResponse.hits.hits.length
        response['search-results'] = postResponse
        response['users'] = userResponse

      }


      res.status(200).json(response)

    }

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}

exports.newsfeedTrending = async (req, res) => {
  try {

    uniqueUserId = await db.post.find({
      shared: {
        $ne: true
      }
    }).distinct('postBy')

    postIds = []
    for (let i = 0; i < uniqueUserId.length; i++) {
      post = await db.post.findOne({
        postBy: uniqueUserId[i]
      })
      postIds.push(post._id)
    }
    // console.log(postIds)

    postResponse = await db.post.arrayPostDetail(postIds)
    response = []
    for (let i = 0; i < postResponse.length; i++) {
      if (postResponse[i].postContentType == "image") {
        data = {
          userProfilePic: postResponse[i].imagePost.postBy.profilePic,
          postId: postResponse[i]._id
        }
        response.push(data)
      }
      if (postResponse[i].postContentType == "video") {
        data = {
          userProfilePic: postResponse[i].videoPost.postBy.profilePic,
          postId: postResponse[i]._id
        }
        response.push(data)
      }
      if (postResponse[i].postContentType == "text") {
        data = {
          userProfilePic: postResponse[i].textPost.postBy.profilePic,
          postId: postResponse[i]._id
        }
        response.push(data)
      }
      if (postResponse[i].postContentType == "poll") {
        data = {
          userProfilePic: postResponse[i].pollPost.postBy.profilePic,
          postId: postResponse[i]._id
        }
        response.push(data)
      }
    }

    res.status(200).json(response.slice(0, 10))
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}

exports.newsFeed = async (req, res) => {
  try {
    const {
      dataType,
      postId
    } = req.body

    data = await db.user.findById(req.userData.userId, 'newsfeedPosts')
    var allPosts = data.newsfeedPosts.reverse()


    userData = await db.user.findById(req.userData.userId).select('following')

    if (!data) {
      res.status(404).json({
        error: " No data to show.!"
      })
    } else if (!userData) {
      res.status(404).json({
        error: " User doesn't exist"
      })
    } else {
      totalUser = await db.user.find().distinct('_id')

      usersToShow = []
      if (userData) {
        usersToShow = totalUser.filter(n => !userData.following.includes(n))
      }
      if (!usersToShow) {
        console.log("usersToShow not found.!")
      }

      responseArray = []

      if (dataType == "previous" && allPosts.includes(postId)) {
        postIndex = allPosts.indexOf(postId)

        usersResponse = await db.user.userArrayDetails(usersToShow)
        postResponse = await db.post.arrayPostDetail(allPosts.slice(postIndex + 1, postIndex + 21))

        // creating response
        responseArray.push(...postResponse.slice(0, 10))

        if (postResponse.length > 5) {
          userBlock = {
            postContentType: "profileReference",
            title: 'People You may know',
            data: usersResponse
          }
          responseArray.push(userBlock)
        }

        responseArray.push(...postResponse.slice(10, 20))
        res.status(200).json(responseArray)

      } else if (dataType == "latest" && allPosts.includes(postId)) {
        postIndex = allPosts.indexOf(postId)

        usersResponse = await db.user.userArrayDetails(usersToShow)
        postResponse = await db.post.arrayPostDetail(allPosts.slice(0, postIndex))

        // creating response
        responseArray.push(...postResponse.slice(0, 10))

        if (postResponse.length > 5) {
          userBlock = {
            postContentType: "profileReference",
            title: 'People You may know',
            data: usersResponse
          }
          responseArray.push(userBlock)
        }


        responseArray.push(...postResponse.slice(10, 20))
        res.status(200).json(responseArray)
      } else {
        usersResponse = await db.user.userArrayDetails(usersToShow)
        postResponse = await db.post.arrayPostDetail(allPosts.slice(0, 20))


        // creating response
        responseArray.push(...postResponse.slice(0, 10))

        if (postResponse.length > 5) {
          userBlock = {
            postContentType: "profileReference",
            title: 'People You may know',
            data: usersResponse
          }
          responseArray.push(userBlock)
        }

        responseArray.push(...postResponse.slice(10, 20))
        res.status(200).json(responseArray)
      }
    }

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}

exports.relatedPost = async (req, res) => {
  try {
    const {
      postId
    } = req.body

    postDetail = await db.post.postDetail(postId)

    // to give data from ml
    //temporary
    posts = await db.post.find({
      _id: {
        $ne: postId
      },
      postContentType: postDetail.postContentType
    }).distinct('_id')


    postResponse = await db.post.arrayPostDetail(posts.slice(0, 20))

    res.status(200).json(postResponse)

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      error: error.message
    });
  }
}

// To do
exports.explore = async (req, res) => {
  console.log(req.userId)
  
  try{
    tags=await db.tag.getTrendingTags();
    res.status(200).json(tags)
  }catch(error){
    console.log(error)
    res.status(500).json({error: error.message})
  }
}

exports.shortVideos = async (req, res) => {
  try {
    const {
      dataType,
      postId
    } = req.body
    data = await db.postview.findById("613b26eae8548fc8339af207").select('shortVideos')
    var posts = data.shortVideos.reverse()

    if (dataType == "previous" && posts.includes(postId)) {
      postIndex = posts.indexOf(postId)
      console.log(postIndex)
      const explore = await db.post.arrayPostDetail(posts.slice(postIndex + 1, postIndex + 11))
      res.status(200).json(explore)

    } else {
      const explore = await db.post.arrayPostDetail(posts.slice(0, 20))
      res.status(200).json(explore)
    }

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}

exports.nearYou = async (req, res) => {
  try {
    data = "Data Unavailable...!"

    res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}

exports.contests = async (req, res) => {
  try {
    data = "Data Unavailable...!"

    res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}

exports.rewards = async (req, res) => {
  try {
    data = "Data Unavailable...!"

    res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}