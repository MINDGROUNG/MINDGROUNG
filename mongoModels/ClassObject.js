const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassObject = new mongoose.Schema({
    userUID:        {type: Number},
    userName:       {type: String},
    hostType:       {type: String},
    dormancy:       {type: String},
    objectType:      {type: String},
    classObject:      {type: Object},
    gatheringMember:      {type: Array},
    gatheringEvent:      {type: Array},
    participants:   {type: Array},
    bookmarks:      {type: Array},
    regedate:       {type: Date, default: Date.now},
    updatedAt:      {type: Date, default: Date.now}
},{ versionKey: false });

module.exports = mongoose.model('classobject', ClassObject);