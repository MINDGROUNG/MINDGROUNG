const Sequelize = require('sequelize');

module.exports = class statistics extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            statisticsID : {
                type : Sequelize.INTEGER,
                autoIncrement :true,
                primaryKey : true,
            },
            thisDate : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            visitorNum : {
                type : Sequelize.INTEGER,
                allowNull:true,
            },
            currency : {
                type : Sequelize.INTEGER,
                allowNull:true,
            }
        }, {
            sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'statistics',
            tableName : 'statistics',
            paranoid : false,
            charset : 'utf8mb4',
            collate : 'utf8mb4_unicode_ci'
        });
    }
    static associate(db) {}
}