const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnrollClassInfo = new mongoose.Schema({
    userUID:        {type: Number},
    userName:       {type: String},
    classID:        {type: String},
    classInfo:      {type: Object},
    classProgress:  {type: Object},
    isCompleted:    {type: String},
    objectType:      {type: String},
    eventID:           {type: String},
    regedate:       {type: Date, default: Date.now},
    updatedAt:      {type: Date, default: Date.now}
},{ versionKey: false });


module.exports = mongoose.model('enrollclassinfo', EnrollClassInfo);