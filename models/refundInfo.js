const Sequelize = require('sequelize');

module.exports = class refundInfo extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            refundInfoID : {
                type : Sequelize.INTEGER,
                autoIncrement :true,
                primaryKey : true,
            },
            payResultID : {
                type : Sequelize.INTEGER,
                allowNull:false,
            },
            payType : {
                type : Sequelize.STRING(32),
                allowNull:true,
            },
            refundType : {
                type : Sequelize.STRING(256),
                allowNull:true,
            },
            refundReason : {
                type : Sequelize.TEXT('long'),
                allowNull:true,
            },
            refundProgress : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            etc : {
                type : Sequelize.TEXT('long'),
                allowNull:true,
            }
        }, {
            sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'refundInfo',
            tableName : 'refundInfo',
            paranoid : false,
            charset : 'utf8mb4',
            collate : 'utf8mb4_unicode_ci'
        });
    }
    static associate(db) {}
}