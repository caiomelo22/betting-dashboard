const database = require("../database/db");

const BetType = database.sequelize.define("bet_types", {
    name: {
        type: database.Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = {
    BetType
};