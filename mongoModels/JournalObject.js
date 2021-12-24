const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JournalObject = new mongoose.Schema({
    userUID:        {type: Number},
    userName:       {type: String},
    hostType:       {type: String},
    journalObject:    {type: Object},
    regedate:       {type: Date, default: Date.now},
    updatedAt:      {type: Date, default: Date.now},
    journalState:      {type: String},
    journalLike:      {type: Array}
},{ versionKey: false });

module.exports = mongoose.model('journalobject', JournalObject);