const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//let autoIncrement = require("mongodb-autoincrement"); 자동 증가

const MemberData = new mongoose.Schema({
    userUID:        {type: Number},
    userEmail:      {type: String},
    userName:       {type: String},
    gender:         {type: String},
    location:       {type: String},
    regedate:       {type: Date, default: Date.now},
    updatedAt:     {type: Date, default: Date.now}
},{ versionKey: false }); //버전키 사용 여부 (버전관리를 목적으로 한다면 사용한다.)

//memberData 자동 증가값
// autoIncrement.setDefaults({
//     collection: 'memberdatas',     // collection name for counters, default: counters
//     field: 'memberUID',               // auto increment field name, default: _id
//     step: 1             // auto increment step
// });

//MemberData.plugin(autoIncrement.mongoosePlugin);
module.exports = mongoose.model('memberdata', MemberData);