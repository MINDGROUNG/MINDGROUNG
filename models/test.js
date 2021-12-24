const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    test:String,
    test2:String
});

module.exports = mongoose.model('test', testSchema, 'test');

