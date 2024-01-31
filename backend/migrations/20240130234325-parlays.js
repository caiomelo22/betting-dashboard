'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('parlays', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            finished: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            won: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            value: {
              type: Sequelize.FLOAT,
              allowNull: false,
            },
            odds: {
              type: Sequelize.FLOAT,
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
        return queryInterface.dropTable('parlays');
    }
};
