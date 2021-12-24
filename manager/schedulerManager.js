//Constant Variable
const schedule = require('node-schedule');
const commonUtil = require('../util/commonUtil.js');
const config = require('../config/config.json');
const mysql = require('mysql');
const connection = mysql.createConnection(config.database);
connection.on('error', function() {});
const fs = require('fs');
const DataCacheManager = require('./dataCacheManager');
const dataCacheManager = DataCacheManager.getInstance();


let instance;

class Scheduler 
{
    constructor() {}

    static getInstance()
    {
        if (!instance)
        {
            instance = new Scheduler();
        }

        return instance;
    }

    init()
    {
        logger.info("Scheduler init Start");

        //매 분마다 작동하는 스케줄러
        schedule.scheduleJob('* * * * *',()=>{
        });
    }
}

module.exports = Scheduler;