'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("users", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            refreshToken: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            totalDeposited: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
        });

        await queryInterface.addIndex('users', ['email']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};
