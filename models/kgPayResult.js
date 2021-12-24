const Sequelize = require('sequelize');


module.exports = class KgPayResult extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            payResultUID : {
                type : Sequelize.INTEGER,
                autoIncrement :true,
                primaryKey : true,
            },
            userUID : {
                type : Sequelize.INTEGER,
                allowNull:false,
            },
            userName : {
                type : Sequelize.STRING(64),
                allowNull:false,
            },
            userType : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            goodType : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            orderNumber : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            goodSellerUID : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            goodSellerName : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            goodSellerHostType : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            goodUID : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            goodName : {
                type : Sequelize.STRING(256),
                allowNull:true,
            },
            resultCode : {
                type : Sequelize.STRING(32),
                allowNull:true,
            },
            resultMsg : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            payStatus : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            authToken : {
                type : Sequelize.TEXT('long'),
                allowNull:true,
            },
            buyerTel: {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            applDate : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            buyerEmail : {
                type : Sequelize.STRING(128),
                allowNull:true,
            },
            buyerName : {
                type : Sequelize.STRING(128),
                allowNull:true,
            },
            cardUsePoint : {
                type : Sequelize.STRING(32),
                allowNull:true,
            },
            cardNum : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            authSignature : {
                type : Sequelize.TEXT('long'),
                allowNull:true,
            },
            tid : {
                type : Sequelize.STRING(256),
                allowNull:true,
            },
            eventCode : {
                type : Sequelize.STRING(32),
                allowNull:true,
            },
            totalPrice : {
                type : Sequelize.STRING(32),
                allowNull:true,
            },
            payMethod : {
                type : Sequelize.STRING(32),
                allowNull:true,
            },
            cardMemberNum : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            MOID : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            cardPoint : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            currency : {
                type : Sequelize.STRING(32),
                allowNull:true,
            },
            cardPurchaseCode : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            cardPrtcCode : {
                type : Sequelize.STRING(32),
                allowNull:true,
            },
            applTime : {
                type : Sequelize.STRING(32),
                allowNull:true,
            },
            cardCheckFlag : {
                type : Sequelize.STRING(32),
                allowNull:true,
            },
            cardCode : {
                type : Sequelize.STRING(32),
                allowNull:true,
            },
            cardBankCode : {
                type : Sequelize.STRING(32),
                allowNull:true,
            },
            cardTerminalNum : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            pFnNm : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            pSubCnt : {
                type : Sequelize.STRING(32),
                allowNull:true,
            },
            applNum : {
                type : Sequelize.STRING(32),
                allowNull:true,
            },
            approveResultCode : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            approveResultMsg : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            cardInterest : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            cardApplPrice : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            cardGwCode : {
                type : Sequelize.STRING(32),
                allowNull:true,
            },
            custEmail : {
                type : Sequelize.STRING(128),
                allowNull:true,
            },
            cardExpire : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            cardPurchaseName : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            payDevice : {
                type : Sequelize.STRING(32),
                allowNull:true,
            }
        }, {
            sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'kgPayResult',
            tableName : 'kgPayResult',
            paranoid : false,
            charset : 'utf8mb4',
            collate : 'utf8mb4_unicode_ci'
        });
    }
    static associate(db) {}
}