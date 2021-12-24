const Sequelize = require('sequelize');


module.exports = class KgPayRequest extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            payRequestUID : {
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
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            buyerName : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            buyerEmail : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            phoneNumber : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            price : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            gopaymethod : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            signature : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            oid : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            timestamp : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            version : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            currency : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            acceptedMethod : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            requestTime : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
        }, {
            sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'kgPayRequest',
            tableName : 'kgPayRequest',
            paranoid : false,
            charset : 'utf8mb4',
            collate : 'utf8mb4_unicode_ci'
        });
    }
    static associate(db) {}
}