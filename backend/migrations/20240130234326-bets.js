'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('bets', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            matchId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'matches', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdByEmail: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            value: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            odds: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            won: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            push: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            parlayId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: 'parlays', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
        return queryInterface.dropTable('bets');
    }
};
