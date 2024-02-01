const { LeagueTeam } = require('../models/LeagueTeam');

const League = require('../models/League').League;
const Team = require('../models/Team').Team;

const list = async (req, res) => {
    try {
        let leagues = [];

        leagues = await League.findAll({
            where: {inactive: false},
            include: {
                model: LeagueTeam, as: 'teams',
                include: { model: Team, as: 'team' },
                order: [['createdAt', 'DESC']]
            }
        });

        for(let i = 0; i < leagues.length; i++) {
            let maxSeason = leagues[0].season

            leagues[i].teams = leagues[i].teams.filter(x => x.season == maxSeason)
        }

        return res.json(leagues)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ data: 'An error has occured', error })
    }
};

module.exports = {
    list,
}