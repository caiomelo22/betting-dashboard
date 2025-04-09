'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bets', 'sportsbook', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Bet365'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bets', 'sportsbook');
  }
};
