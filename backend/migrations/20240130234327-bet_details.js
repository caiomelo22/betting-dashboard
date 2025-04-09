'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('bet_details', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            betId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'bets', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            type: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            details: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            earlyPayout: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
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
        return queryInterface.dropTable('bet_details');
    }
};
