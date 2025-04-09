'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('financial_history', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            userEmail: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            value: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            actionType: {
                type: Sequelize.ENUM('Withdraw', 'Deposit'),
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable('financial_history');
    }
};
