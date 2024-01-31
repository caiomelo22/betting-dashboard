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
            userId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: 'users', key: 'id' },
                onUpdate: 'SET NULL',
                onDelete: 'SET NULL',
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
                allowNull: false,
                defaultValue: false,
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
