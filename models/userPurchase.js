const Sequelize = require('sequelize');

module.exports = class UserPurchase extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            purchaseUID : {
                type : Sequelize.INTEGER,
                autoIncrement :true,
                primaryKey : true,
            },
            userUID : {
                type : Sequelize.INTEGER,
                allowNull:false,
            },
            pgType : {
                type : Sequelize.STRING(20),
                allowNull:false,
            },
            type : {
                type : Sequelize.STRING(10),
                allowNull:false,
            },
            purchaseInterval : {
                type : Sequelize.INTEGER,
                allowNull:false,
            },
            itemName : {
                type : Sequelize.STRING(512),
                allowNull:false,
            }
        }, {
            sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'userPurchase',
            tableName : 'userPurchase',
            paranoid : false,
            charset : 'utf8mb4',
            collate : 'utf8mb4_unicode_ci'
        });
    }
    static associate(db) {}
}