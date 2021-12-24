const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChatListInfoObject = new mongoose.Schema({

    chatListInfoNum:       {type: String},
    preUserUID:            {type: String},
    preUserName:           {type: String},
    nextUserUID:           {type: String},
    nextUserName:          {type: String},
    chatLog:               {type: Object},
    chatUpdateTime:        {type: String}
    
},{ versionKey: false });

module.exports = mongoose.model('chatListInfoObject', ChatListInfoObject)