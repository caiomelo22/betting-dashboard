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
            createdByEmail: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            sport: {
                type: Sequelize.STRING,
                allowNull: true
            },
            league: {
                type: Sequelize.STRING,
                allowNull: true
            },
            teamA: {
                type: Sequelize.STRING,
                allowNull: false
            },
            teamB: {
                type: Sequelize.STRING,
                allowNull: false
            },
            eventDate: {
                type: Sequelize.DATE,
                allowNull: false
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
