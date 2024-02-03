'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('teams', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(50),
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

        // Adding an index for the 'name' column
        await queryInterface.addIndex('teams', ['name']);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable('teams');
    }
};
