const database = require("../database/db");
const { BetDetails } = require('./BetDetails')

const Bet = database.sequelize.define("bets", {
    createdByEmail: {
        type: database.Sequelize.STRING,
        allowNull: false,
    },
    sport: {
        type: database.Sequelize.STRING,
        allowNull: true
    },
    league: {
        type: database.Sequelize.STRING,
        allowNull: true
    },
    teamA: {
        type: database.Sequelize.STRING,
        allowNull: false
    },
    teamB: {
        type: database.Sequelize.STRING,
        allowNull: false
    },
    sportsbook: {
        type: database.Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: database.Sequelize.DATE,
        allowNull: false
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