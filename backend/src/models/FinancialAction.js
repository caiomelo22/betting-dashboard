const database = require("../database/db");

const FinancialAction = database.sequelize.define("financial_actions", {
  value: {
    type: database.Sequelize.FLOAT,
    allowNull: false,
  },
  actionType: {
    type: database.Sequelize.ENUM('Withdraw', 'Deposit'),
    allowNull: false,
  }
});

module.exports = {
    FinancialAction
};