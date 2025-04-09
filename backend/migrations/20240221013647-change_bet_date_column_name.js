'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('bets', 'eventDate', 'date');
  },

  down: async (queryInterface, Sequelize) => {
    // Rename the column back to eventDate in case of rollback
    await queryInterface.renameColumn('bets', 'date', 'eventDate');
  }
};