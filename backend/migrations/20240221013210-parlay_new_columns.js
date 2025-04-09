'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('parlays', 'payout', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('parlays', 'push', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('parlays', 'payout');
    await queryInterface.removeColumn('parlays', 'push');
  }
};
