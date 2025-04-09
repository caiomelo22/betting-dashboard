const database = require("../database/db");

const BetDetails = database.sequelize.define("bet_details", {
    betId: {
        type: database.Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'bets', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    type: {
        type: database.Sequelize.STRING,
        allowNull: false,
    },
    details: {
        type: database.Sequelize.STRING,
        allowNull: true,
    },
    earlyPayout: {
        type: database.Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
});

module.exports = {
    BetDetails
};