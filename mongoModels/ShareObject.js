const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShareObject = new mongoose.Schema({
    userUID:        {type: Number},
    userName:       {type: String},
    hostType:       {type: String},
    shareType:      {type: String},
    shareAccess:      {type: String},
    shareComment:      {type: String},
    shareObject:    {type: Object},
    regedate:       {type: Date, default: Date.now},
    updatedAt:      {type: Date, default: Date.now}
},{ versionKey: false });

module.exports = mongoose.model('shareObject', ShareObject);