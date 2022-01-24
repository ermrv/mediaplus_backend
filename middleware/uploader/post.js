const multer = require('multer');
const db = require('../../models');

// Post array upload 
const postFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'video/mp4' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const postImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/posts/');
    },
    filename: function (req, file, cb) {
        // db.user.findOne({ where: { _id: req.userData._id } })
        // .then(user => {
        //     cb(null, user._id +  "abc");
        // })
        cb(null, "post_" + new Date().toISOString() + file.originalname);
    }
});

module.exports = multer({
    storage: postImage,
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // },
    fileFilter: postFilter,
}).array('postFile')

