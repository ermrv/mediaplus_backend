const multer = require('multer');
const db = require('../../models');

// Profile Picture upload 
const profilePicFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const profilePicImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/pictures/');
    },
    filename: function (req, file, cb) {
        // db.user.findOne({ where: { _id: req.userData._id } })
        // .then(user => {
        //     cb(null, user._id +  "abc");
        // })
        cb(null, "profilepic_" + new Date().toISOString() + file.originalname);
    }
});

module.exports = multer({
    storage: profilePicImage,
    fileFilter: profilePicFilter
}).single('image')

