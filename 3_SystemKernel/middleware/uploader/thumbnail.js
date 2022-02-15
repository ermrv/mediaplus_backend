const multer = require('multer');
const db = require('../../database/models');

// thumbnail filter
const thumbnailFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        // console.log(file.mimetype)
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const thumbnailImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/thumbnail/');
    },
    filename: function (req, file, cb) {
        // db.user.findOne({ where: { _id: req.userData._id } })
        // .then(user => {
        //     cb(null, user._id +  "abc");
        // })
        cb(null, "thumbnail_" + new Date().toISOString() + file.originalname);
    }
});

module.exports = multer({
    storage: thumbnailImage,
    fileFilter: thumbnailFilter
}).single('thumbnail')

