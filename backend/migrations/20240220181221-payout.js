'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bets', 'payout', {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bets', 'payout');
  }
};
