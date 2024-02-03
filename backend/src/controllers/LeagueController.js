const { LeagueTeam } = require('../models/LeagueTeam');

const League = require('../models/League').League;
const Team = require('../models/Team').Team;
const express = require('express');

const router = express.Router();

router.get('/list', async (req, res) => {
    try {
        let leagues = [];

        leagues = await League.findAll({
            where: {inactive: false},
            include: {
                model: LeagueTeam, as: 'teams',
                include: { model: Team, as: 'team' },
                order: [['season', 'DESC']]
            }
        });

        for(let i = 0; i < leagues.length; i++) {
            let latestSeason = leagues[i].teams[0].season

            leagues[i].teams = leagues[i].teams.filter(x => x.season == latestSeason)
        }

        return res.json(leagues)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
})

router.post('/create', async (req, res) => {
    try {
        const {sportId, name, season, teams} = req.body

        const league = await League.create({sportId, name})

        let leagueTeamsData = []
        for(let i = 0; i < teams.length; i++)
        {
            const [team, _] = await Team.findOrCreate({
                where: { name: teams[i].name },
            });
            leagueTeamsData.push({
                teamId: team.id,
                leagueId: league.id,
                season
            })
        }

        await Team.bulkCreate(leagueTeamsData)

        return res.json(league)
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).json({ error })
    }
})

module.exports = router