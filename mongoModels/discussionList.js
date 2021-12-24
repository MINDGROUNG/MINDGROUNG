const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiscussionList = new mongoose.Schema({
    classID:        {type: String},
    chapterNum:     {type: Number},
    contentNum:     {type: Number},
    comment:        {type: Array},
    regedate:       {type: Date, default: Date.now},
    updatedAt:      {type: Date, default: Date.now}
},{ versionKey: false });


module.exports = mongoose.model('discussionList', DiscussionList);