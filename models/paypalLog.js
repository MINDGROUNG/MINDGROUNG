const Sequelize = require('sequelize');

module.exports = class PaypalLog extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            paypalLogUID : {
                type : Sequelize.INTEGER,
                autoIncrement :true,
                primaryKey : true,
            },
            userUID : {
                type : Sequelize.INTEGER,
                allowNull:false,
            },
            type : {
                type : Sequelize.STRING(10),
                allowNull:false,
            },
            orderID : {
                type : Sequelize.STRING(255),
                allowNull:false,
            },
            subscriptionID : {
                type : Sequelize.STRING(255),
            },
            billingToken : {
                type : Sequelize.STRING(512),
            },
            facilitatorAccessToken : {
                type : Sequelize.STRING(512),
            },
            intent : {
                type : Sequelize.STRING(20),
            },
            status : {
                type : Sequelize.STRING(20),
            },
            currencyCode : {
                type : Sequelize.STRING(10),
                defaultValue: 'USD'
            },
            value : {
                type : Sequelize.STRING(50),
            },
            payerID : {
                type : Sequelize.STRING(255),
                allowNull:false,
            },
            payerEmail : {
                type : Sequelize.STRING(255),
                allowNull:false,
            },
            verificationData : {
                type : Sequelize.TEXT('long'),
                allowNull:false,
            }
        }, {
            sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'paypalLog',
            tableName : 'paypalLog',
            paranoid : false,
            charset : 'utf8mb4',
            collate : 'utf8mb4_unicode_ci'
        });
    }
    static associate(db) {}
}