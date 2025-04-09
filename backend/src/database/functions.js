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

async function getUserDistinctSportsbooks(userEmail) {
    const queryResult = await sequelize.query(`
        SELECT
            DISTINCT sportsbook
        FROM bets
        WHERE
            createdByEmail = '${userEmail}'
        `, {
        type: sequelize.QueryTypes.SELECT
    });

    const distinctSportsbooks = queryResult.map(result => result.sportsbook);

    return distinctSportsbooks
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

    let sportsGrouped = []

    for (let i = 0; i < result.length; i++) {
        let sportIndex = sportsGrouped.map((x) => x.name).indexOf(result[i].sport)
        if (sportIndex == -1) {
            sportsGrouped.push({
                'name': result[i].sport,
                'leagues': []
            })
            sportIndex = sportsGrouped.length - 1
        }

        sportsGrouped[sportIndex]['leagues'].push({
            'name': result[i].league,
            'teams': result[i].teams.split(',')
        })
    }

    return sportsGrouped
}


module.exports = {
    getUserDistinctLeagues,
    getUserDistinctSportsbooks,
    getUserDistinctSports,
    getUserSportsChain
}
