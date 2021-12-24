const Sequelize = require('sequelize');

module.exports = class TestPaySetting extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            payUID : {
                type : Sequelize.INTEGER,
                autoIncrement :true,
                primaryKey : true,
            },
            userUID : {
                type : Sequelize.INTEGER,
                allowNull:false,
            },
            currencyType : {
                type : Sequelize.STRING(128),
            },
            exchangeRate : {
                type : Sequelize.INTEGER,
            },
            amountPayment : {
                type : Sequelize.BIGINT,
            },
            billingPeriod : {
                type : Sequelize.STRING(50),
            },
            billingDate : {
                type : Sequelize.DATEONLY,
            },
            nextBillingDate : {
                type : Sequelize.DATEONLY,
            },
            billingBank : {
                type : Sequelize.STRING(128),
            },
            cardNumberFirst : {
                type : Sequelize.TEXT('long'),
                allowNull:false,
            },
            cardNumberHashing : {
                type : Sequelize.TEXT('long'),
                allowNull:false,
            },
            cardDate : {
                type : Sequelize.TEXT('long'),
                allowNull:false,
            },
            cardCVC : {
                type : Sequelize.TEXT('long'),
                allowNull:false,
            },
            cardType : {
                type : Sequelize.STRING(50),
                allowNull:false,
            },
            fullName : {
                type : Sequelize.STRING(128),
                allowNull:false,
            },
            address : {
                type : Sequelize.TEXT('long'),
                allowNull:false,
            },
            phoneNumber : {
                type : Sequelize.STRING(128),
                allowNull:false,
            },
            calculateCurrencyType : {
                type : Sequelize.STRING(128),
                allowNull:false,
            },
            calculateBank : {
                type : Sequelize.STRING(128),
                allowNull:false,
            },
            calculateAccountNumber : {
                type : Sequelize.STRING(128),
                allowNull:false,
            },
            payPal : {
                type : Sequelize.TEXT('long'),
                allowNull:false,
            },
            idCard : {
                type : Sequelize.TEXT('long'),
            },
            passBooksCover : {
                type : Sequelize.TEXT('long'),
            },
            businessRegistration : {
                type : Sequelize.TEXT('long'),
            },
            registDate : {
                type : Sequelize.DATE,
            },
            updateDate : {
                type : Sequelize.DATE,
            }
        }, {
            sequelize,
            timestamps : false,
            underscored : false,
            modelName : 'testPaySetting',
            tableName : 'testPaySetting',
            paranoid : false,
            charset : 'utf8mb4',
            collate : 'utf8mb4_unicode_ci'
        });
    }
    static associate(db) {}
}