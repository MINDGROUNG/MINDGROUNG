const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectBookmarks = new mongoose.Schema({
    userUID:        {type: Number},
    userName:       {type: String},
    hostType:       {type: String},
    dormancy:       {type: String},
    bookmarks:      {type: Object},
    regedate:       {type: Date, default: Date.now},
    updatedAt:      {type: Date, default: Date.now}
},{ versionKey: false });

module.exports = mongoose.model('objectbookmarks', ObjectBookmarks);