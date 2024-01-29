const database = require("../database/db");

const User = database.sequelize.define("users", {
  name: {
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
});

module.exports = {
  User
};