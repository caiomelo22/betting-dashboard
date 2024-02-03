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
    createdByEmail: {
        type: database.Sequelize.STRING,
        allowNull: false,
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
        allowNull: true,
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