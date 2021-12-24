const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassAdditionalInfo = new mongoose.Schema({
    classID:          {type: String},
    classTitle:       {type: String},
    category:         {type: String},
    classThumbNail:   {type: String},
    writerUID:        {type: Number},
    writerName:       {type: String},
    reviewerUID:      {type: Number},
    reviewerName:     {type: String},
    review:           {type: Object},
    reviewAnswer:     {type: Object},
    bookmark:         {type: String}
},{ versionKey: false });

module.exports = mongoose.model('classAdditionalInfo', ClassAdditionalInfo)