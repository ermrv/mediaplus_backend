var mongoose = require('mongoose');
require('dotenv').config()
const mongoDB = process.env.MONGOURI

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true, 
    keepAlive: true,
    
    poolSize: 10,
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,

    useUnifiedTopology: true,
    useFindAndModify: false,

})
.then(() => console.log("******************************" + "Mongodb Connected" + "******************************")
).catch(err => console.log("Error: " + err))

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
