const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            userUID : {
                type : Sequelize.INTEGER,
                autoIncrement :true,
                primaryKey : true,
            },
            userEmail : {
                type : Sequelize.STRING(127),
                allowNull:false,
                unique : true,
            },
            facebookID : {
                type : Sequelize.STRING(127),
                unique : true,
            },
            googleID : {
                type : Sequelize.STRING(127),
                unique : true,
            },
            appleID : {
                type : Sequelize.STRING(127),
                unique : true,
            },
            pwd : {
                type : Sequelize.STRING(127),
                allowNull:false,
            },
            userType : {
                type : Sequelize.STRING(63),
            },
            userName : {
                type : Sequelize.STRING(63),
            },
            gender : {
                type : Sequelize.STRING(31),
            },
            location : {
                type : Sequelize.STRING(255),
            },
            hostType : {
                type : Sequelize.STRING(127),
            },
            userAttribute : {
                type : Sequelize.TEXT('long'),
            },
            following : {
                type : Sequelize.JSON,
            },
            businessAddress : {
                type : Sequelize.STRING(255),
            },
            shareableSchedule : {
                type : Sequelize.STRING(255),
            },
            introduce : {
                type : Sequelize.TEXT('long'),
            },
            particeList : {
                type : Sequelize.TEXT('long'),
            },
            externalConnected : {
                type : Sequelize.STRING(255),
            },
            otp : {
                type : Sequelize.STRING(255),
            },
            test : {
                type : Sequelize.STRING(45),
            },
            userBio : {
                type : Sequelize.TEXT('long'),
            },
            region : {
                type : Sequelize.STRING(63),
            },
            birth :{
                type : Sequelize.STRING(63),
            },
            hostIntroduce : {
                type : Sequelize.TEXT('long'),
            },
            country : {
                type : Sequelize.STRING(255),
            },
            state : {
                type : Sequelize.STRING(255),
            },
            city : {
                type : Sequelize.STRING(255),
            },
            streetAddress : {
                type : Sequelize.STRING(255),
            },
            career : {
                type : Sequelize.TEXT('long'),
            },
            brandlocation : {
                type : Sequelize.STRING(255),
            },
            brandplace : {
                type : Sequelize.STRING(255),
            },
            brandagree : {
                type : Sequelize.STRING(255),
            },
            brandDatetime : {
                type : Sequelize.TEXT('long'),
            },
            paymentExpireDate : {
                type : Sequelize.DATE,
            },
            thumbNail : {
                type : Sequelize.TEXT('long'),
            },
            facebookID : {
                type : Sequelize.STRING(128),
            },
            googleID : {
                type : Sequelize.STRING(128),
            },
            appleID : {
                type : Sequelize.STRING(128),
            },
            myPageAccess : {
                type : Sequelize.STRING(30),
                allowNull:false,
                defaultValue: "Public"
            },
            myPageCommunityAccess : {
                type : Sequelize.STRING(30),
                allowNull:false,
                defaultValue: "Public"
            },
            myPageClassAccess : {
                type : Sequelize.STRING(30),
                allowNull:false,
                defaultValue: "Public"
            },
            myPageGatheringAccess : {
                type : Sequelize.STRING(30),
                allowNull:false,
                defaultValue: "Public"
            },
            myPageJournalAccess : {
                type : Sequelize.STRING(30),
                allowNull:false,
                defaultValue: "Public"
            },
        }, {
            sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'user',
            tableName : 'users',
            paranoid : false,
            charset : 'utf8mb4',
            collate : 'utf8mb4_unicode_ci'
        });
    }
    static associate(db) {}
}