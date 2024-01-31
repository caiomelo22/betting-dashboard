const database = require("../database/db");
const { BetDetails } = require('./BetDetails')

const Bet = database.sequelize.define("bets", {
    matchId: {
        type: database.Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'matches', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    userId: {
        type: database.Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
    },
    value: {
        type: database.Sequelize.FLOAT,
        allowNull: true,
    },
    odds: {
        type: database.Sequelize.FLOAT,
        allowNull: true,
    },
    won: {
        type: database.Sequelize.BOOLEAN,
        allowNull: true,
    },
    push: {
      type: database.Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    parlayId: {
        type: database.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: false,
        references: { model: 'parlays', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
});

BetDetails.belongsTo(Bet, { as: 'bet' });
Bet.hasOne(BetDetails, { foreignKey: 'betId', as: 'details' });

module.exports = {
    Bet
};