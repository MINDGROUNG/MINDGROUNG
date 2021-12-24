const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GatheringObject = new mongoose.Schema({
    userUID:        {type: Number},
    userName:       {type: String},
    gatheringObject:    {type: Object},
    regedate:       {type: Date, default: Date.now},
    updatedAt:      {type: Date, default: Date.now},
    gatheringMember:      {type: Array},
    gatheringEvent:      {type: Array}
},{ versionKey: false });

module.exports = mongoose.model('gatheringobject', GatheringObject);