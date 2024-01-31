'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('matches', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            leagueId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'leagues', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            homeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'teams', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            awayId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'teams', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            homeScore: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            awayScore: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            date: {
                type: Sequelize.DATE,
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
        return queryInterface.dropTable('matches');
    }
};
