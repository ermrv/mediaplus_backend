const multer = require('multer');
const db = require('../../models');


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

module.exports.thumbnail = multer({
    storage: thumbnailImage,
    fileFilter: thumbnailFilter
}).single('thumbnail')
//.........................................................................//



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

module.exports.profilePic = multer({
    storage: profilePicImage,
    fileFilter: profilePicFilter
}).single('image')
//.........................................................................//


// // Cover Picture upload 
// const coverPicFilter = (req, file, cb) => {
//     // reject a file
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };

// const coverPicImage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/pictures/');
//     },
//     filename: function (req, file, cb) {
//         // db.user.findOne({ where: { _id: req.userData._id } })
//         // .then(user => {
//         //     cb(null, user._id +  "abc");
//         // })
//         cb(null, "coverpic_" + new Date().toISOString() + file.originalname);
//     }
// });

// module.exports.coverPic = multer({
//     storage: coverPicImage,
//     fileFilter: profilePicFilter
// }).single('image')
// //.........................................................................//



// Cover Picture upload 
const coverPicFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const coverPicImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/coverpic/');
    },
    filename: function (req, file, cb) {
        // db.user.findOne({ where: { _id: req.userData._id } })
        // .then(user => {
        //     cb(null, user._id +  "abc");
        // })
        cb(null, "coverpic_" + new Date().toISOString() + file.originalname);
    }
});

module.exports.coverPic = multer({
    storage: coverPicImage,
    fileFilter: coverPicFilter
}).single('image')
//.........................................................................//

// Post array upload 
const postFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'video/mp4' || file.mimetype === 'video/webm' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
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

module.exports.post = multer({
    storage: postImage,
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // },
    fileFilter: postFilter,
}).array('postFile')
//.........................................................................//




// Status Image/Video upload 
const statusFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'video/mp4' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const statusFile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/status/');
    },
    filename: function (req, file, cb) {
        // db.user.findOne({ where: { _id: req.userData._id } })
        // .then(user => {
        //     cb(null, user._id +  "abc");
        // })
        cb(null, "status_" + new Date().toISOString() + file.originalname);
    }
});

module.exports.status = multer({
    storage: statusFile,
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // },
    fileFilter: statusFilter,
}).single('statusFile')
//.........................................................................//






//contest 

//.........................................................................//



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

module.exports.contestPoster = multer({
    storage: contestPosterImage,
    fileFilter: contestPosterFilter
}).single('poster')
//.........................................................................//




// Event poster upload 
const eventPosterFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const eventPosterImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/eventposter/');
    },
    filename: function (req, file, cb) {
        // db.user.findOne({ where: { _id: req.userData._id } })
        // .then(user => {
        //     cb(null, user._id +  "abc");
        // })
        cb(null, "eventPoster_" + new Date().toISOString() + file.originalname);
    }
});

module.exports.eventPoster = multer({
    storage: eventPosterImage,
    fileFilter: eventPosterFilter
}).single('poster')
//.........................................................................//



