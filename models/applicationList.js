const Sequelize = require('sequelize');

module.exports = class applicationList extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            applicationID : {
                type : Sequelize.INTEGER,
                autoIncrement :true,
                primaryKey : true,
            },
            userUID : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            firstName : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            lastName : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            birthYear : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            birthMonth : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            birthDay : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            addressCountry : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            addressState : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            addressCity : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            addressStreetAddress : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            email : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            phoneCode : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            phoneNumber : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            applyingPosition : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            workAuthorization : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            workStartYear : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            workStartMonth : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            workStartDay : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            introduction : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            attachment1 : {
                type : Sequelize.TEXT('long'),
                allowNull:true,
            },
            attachment2 : {
                type : Sequelize.TEXT('long'),
                allowNull:true,
            },
            linkWebsite : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            linkLinkedIn : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            linkFacebook : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            linkYouTube : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            linkOther : {
                type : Sequelize.STRING(64),
                allowNull:true,
            }
        }, {
            sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'applicationList',
            tableName : 'applicationList',
            paranoid : false,
            charset : 'utf8mb4',
            collate : 'utf8mb4_unicode_ci'
        });
    }
    static associate(db) {}
}