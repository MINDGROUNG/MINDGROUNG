const commonUtil = require('../util/commonUtil.js');
const config = require('../config/config.json');
const mongoose = require('mongoose');

let instance;

class DataCacheManagerMongo 
{
    static getInstance()
    {
        if(!instance)
        {
            instance = new DataCacheManagerMongo();
        }

        return instance;
    }

    init()
    {
        //몽구스 프로미스를 글로벌 프로미스로 적용
        mongoose.Promise = global.Promise;

        // 1. 커넥션 연동
        mongoose.connect(`mongodb://${config.mongo.user}:${config.mongo.password}@${config.mongo.host}:${config.mongo.port}/${config.mongo.database}?authSource=mindground&readPreference=primary&ssl=false`,{
            minPoolSize: 1,
            maxPoolSize: 20,
            compression: { compressors: ['zlib'] },
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            socketTimeoutMS: 60000,
            serverSelectionTimeoutMS: 60000,
            loggerLevel: 'error'
        });

        // 2. connection 예외처리
        mongoose.connection.on('connecting', () => console.log('database connecting'));
        mongoose.connection.on('connected', () => console.log('database connected 2'));
        mongoose.connection.on('disconnecting', () => console.log('database disconnecting'));
        mongoose.connection.on('disconnected', () => console.log('database disconnected'));
        mongoose.connection.on('error', () => console.log('database error'));
    }
}

module.exports = DataCacheManagerMongo;
