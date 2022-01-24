# mediaplus
Social media app 


### Backend guideline 
`When a new user is created then following things will be automatically created.(In verifyOtp API)`
- personalized Newsfeed
- status schema
- default profile pic and cover pics default
- homepagevideos
- homepagenearyou
- homepagecontests
- explore
- rewards

### For status 
`It is designed such that each document has separate document in which all status which to be shown is stored.`

### For newsfeed
`Each user has its own newsfeed document in which his personalised newsfeed is stored.`

###  For comment
`For comment, one separate table is for comments and comment is stored in it and it's id is also stored in userDocument PostDocument`

### For reaction
`For reaction, One separate table is for reaction and userId is stored in individual reaction in post and its count is also increased. and reacted posts by user is also stored in user's likedPosts.`

### For photos and highlights
`photos album is created by its name (default profilepic and coverpic ecixt in user profile and any album can be applied in highlights. and current profile pic and cover pic is stored in userdocument with separate key.`

### Points to check 
- check multer error handling (https://www.npmjs.com/package/multer)
- to check unique username (currently removed its uniqueness)