const { sequelize } = require('./db')

async function getDistinctLeagues() {
    const queryResult = await sequelize.query('SELECT DISTINCT league FROM bets', {
        type: sequelize.QueryTypes.SELECT
    });

    const distinctLeagues = queryResult.map(result => result.league);

    return distinctLeagues
}

async function getDistinctSports() {
    const queryResult = await sequelize.query('SELECT DISTINCT sport FROM bets', {
        type: sequelize.QueryTypes.SELECT
    });

    const distinctSports = queryResult.map(result => result.sport);

    return distinctSports
}

module.exports = {
    getDistinctLeagues,
    getDistinctSports
}
