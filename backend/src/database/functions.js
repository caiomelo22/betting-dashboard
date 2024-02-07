const { sequelize } = require('./db')

async function getUserDistinctLeagues(userEmail) {
    const queryResult = await sequelize.query(`
        SELECT
            DISTINCT league
        FROM bets
        WHERE
            createdByEmail = '${userEmail}'
        `, {
        type: sequelize.QueryTypes.SELECT
    });

    const distinctLeagues = queryResult.map(result => result.league);

    return distinctLeagues
}

async function getUserDistinctSports(userEmail) {
    const queryResult = await sequelize.query(`
    SELECT
        DISTINCT sport
    FROM bets
    WHERE
        createdByEmail = '${userEmail}'
    `, {
        type: sequelize.QueryTypes.SELECT
    });

    const distinctSports = queryResult.map(result => result.sport);

    return distinctSports
}

async function getUserSportsChain(userEmail) {
    const result = await sequelize.query(`
        SELECT 
            sport,
            league,
            GROUP_CONCAT(DISTINCT team SEPARATOR ',') AS teams
        FROM (
            SELECT 
                sport,
                league,
                teamA AS team
            FROM bets
            WHERE
                createdByEmail = '${userEmail}'
            UNION
            SELECT 
                sport,
                league,
                teamB AS team
            FROM bets
            WHERE
                createdByEmail = '${userEmail}'
        ) AS all_teams
        GROUP BY sport, league;`, {
        type: sequelize.QueryTypes.SELECT
    });

    let sportsGrouped = {}

    for (let i = 0; i < result.length; i++) {
        if (!sportsGrouped.hasOwnProperty(result[i].sport)) {
            sportsGrouped[result[i].sport] = {
                'leagues': {}
            }
        }

        sportsGrouped[result[i].sport]['leagues'][result[i].league] = result[i].teams.split(',')
    }

    return sportsGrouped
}


module.exports = {
    getUserDistinctLeagues,
    getUserDistinctSports,
    getUserSportsChain
}
