'use strict';
const Sequelize = require('sequelize');
console.log('checker')
const env = process.env.NODE_ENV || 'database';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const User = require('./user');
const Following = require('./following');
const KgPayRequest = require('./kgPayRequest');
const KgPayResult = require('./kgPayResult');
const UserPurchase = require('./userPurchase');
const PaypalLog = require('./paypalLog');
const RefundInfo = require('./refundInfo')
const testPaySetting = require('./testPaySetting');
const Statistics = require('./statistics');
const ApplicationList = require('./applicationList');

const sequelize = new Sequelize(
  config.database,
  config.user, 
  config.password, 
  config
  ,
    {
      pool:{
        max:30,
        min:0,
        acquire:30000,
        idle:10000
      }
    },
  );


db.sequelize = sequelize;
db.User = User;

User.init(sequelize);
User.associate(db);

Following.init(sequelize);
Following.associate(db);

KgPayRequest.init(sequelize);
KgPayRequest.associate(db);

KgPayResult.init(sequelize);
KgPayResult.associate(db);

UserPurchase.init(sequelize);
UserPurchase.associate(db);

PaypalLog.init(sequelize);
PaypalLog.associate(db);

testPaySetting.init(sequelize);
testPaySetting.associate(db);

RefundInfo.init(sequelize);
RefundInfo.associate(db);

RefundInfo.init(sequelize);
RefundInfo.associate(db);

Statistics.init(sequelize);
Statistics.associate(db);

ApplicationList.init(sequelize);
ApplicationList.associate(db);

module.exports = db;
