'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('league_teams', {
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
            teamId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'teams', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            season: {
                type: Sequelize.INTEGER,
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
        return queryInterface.dropTable('league_teams');
    }
};
