//.........................ALL Imports............................
const db = require('../../models');
require('dotenv').config()
var _ = require('lodash');



//....................ALL Photos Page Routes.......................

exports.photos = async (req, res) => {
    try {

        
        res.status(200).json()
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

