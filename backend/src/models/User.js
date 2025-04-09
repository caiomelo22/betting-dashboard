const database = require("../database/db");
const {Bet} = require('./Bet');

const User = database.sequelize.define("users", {
  username: {
    type: database.Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: database.Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: database.Sequelize.STRING,
    allowNull: false,
  },
  refreshToken: {
    type: database.Sequelize.STRING,
    allowNull: true,
  },
  totalDeposited: {
    type: database.Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
});

module.exports = {
  User
};