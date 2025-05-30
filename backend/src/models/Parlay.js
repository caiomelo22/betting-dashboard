const database = require("../database/db");
const { Bet } = require("./Bet");

const Parlay = database.sequelize.define("parlays", {
    createdByEmail: {
        type: database.Sequelize.STRING,
        allowNull: false,
    },
    date: {
        type: database.Sequelize.DATE,
        allowNull: false,
    },
    value: {
      type: database.Sequelize.FLOAT,
      allowNull: false,
    },
    odds: {
      type: database.Sequelize.FLOAT,
      allowNull: false,
    },
    won: {
        type: database.Sequelize.BOOLEAN,
        allowNull: true,
    },
    payout: {
        type: database.Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    push: {
        type: database.Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    sportsbook: {
        type: database.Sequelize.STRING,
        allowNull: false,
    },
});

Parlay.hasMany(Bet, { foreignKey: 'parlayId', as: 'bets' });

module.exports = {
    Parlay
};