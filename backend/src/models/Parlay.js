const database = require("../database/db");
const { Bet } = require("./Bet");

const Parlay = database.sequelize.define("parlays", {
    date: {
        type: database.Sequelize.DATE,
        allowNull: false,
    },
    won: {
        type: database.Sequelize.BOOLEAN,
        allowNull: true,
    },
    value: {
      type: database.Sequelize.FLOAT,
      allowNull: false,
    },
    odds: {
      type: database.Sequelize.FLOAT,
      allowNull: false,
    },
});

Parlay.hasMany(Bet, { foreignKey: 'parlayId', as: 'bets' });

module.exports = {
    Parlay
};