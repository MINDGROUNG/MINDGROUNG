const Sequelize = require('sequelize');

module.exports = class Following extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            followingUID : {
                type : Sequelize.INTEGER,
                autoIncrement :true,
                primaryKey : true,
            },
            userUID : {
                type : Sequelize.INTEGER,
                allowNull:false,
            },
            userName : {
                type : Sequelize.STRING(255),
                allowNull:false,
            },
            userHostType : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
            targetUID : {
                type : Sequelize.INTEGER,
                allowNull:false,
            },
            targetName : {
                type : Sequelize.STRING(255),
                allowNull:false,
            },
            targetHostType : {
                type : Sequelize.STRING(64),
                allowNull:true,
            },
        }, {
            sequelize,
            timestamps : true,
            underscored : false,
            modelName : 'following',
            tableName : 'following',
            paranoid : false,
            charset : 'utf8mb4',
            collate : 'utf8mb4_unicode_ci'
        });
    }
    static associate(db) {}
}