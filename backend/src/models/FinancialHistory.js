const database = require("../database/db");

const FinancialHistory = database.sequelize.define("financial_history", {
  value: {
    type: database.Sequelize.FLOAT,
    allowNull: false,
  },
  userEmail: {
    type: database.Sequelize.STRING,
    allowNull: false,
  },
  actionType: {
    type: database.Sequelize.ENUM('Withdraw', 'Deposit'),
    allowNull: false,
  }
});

module.exports = {
    FinancialHistory
};