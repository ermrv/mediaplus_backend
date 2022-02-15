const multer = require('multer');
const db = require('../../database/models');

// Contest poster upload 
const contestPosterFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const contestPosterImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/contestposter/');
    },
    filename: function (req, file, cb) {
        // db.user.findOne({ where: { _id: req.userData._id } })
        // .then(user => {
        //     cb(null, user._id +  "abc");
        // })
        cb(null, "contestPoster_" + new Date().toISOString() + file.originalname);
    }
});

module.exports = multer({
    storage: contestPosterImage,
    fileFilter: contestPosterFilter
}).single('poster')
