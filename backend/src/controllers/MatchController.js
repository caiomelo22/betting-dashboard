const { BetDetails } = require('../models/BetDetails');

const Bet = require('../models/Bet').Bet;
const Match = require('../models/Match').Match;
const Team = require('../models/Team').Team;
const League = require('../models/League').League;
const express = require('express');

const router = express.Router();

router.get('/list', async (req, res) => {
    try {
        const page = parseInt(req.query.page);

        const pageSize = 15

        const { count, rows } = await Match.findAndCountAll({
            include: [{ model: Team, as: 'homeTeam' }, { model: Team, as: 'awayTeam' }, { model: League, as: 'league' }],
            offset: (page - 1) * pageSize, limit: pageSize, order: [
                ['date', 'DESC'],
                ['updatedAt', 'DESC'],
            ],
        });

        const totalPages = Math.ceil(count / pageSize);

        const returnObject = {
            totalPages,
            matches: rows
        }

        return res.json(returnObject)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
})

router.put('/update', async (req, res) => {
    const { id, homeScore, awayScore } = req.body;

    try {
        const findMatch = await Match.findOne({
            where: { id }, include: {
                model: Bet, as: 'bets',
                include: [{ model: BetDetails, as: 'details' }]
            }
        })

        if (findMatch == null) {
            return res.status(404).send("Match not found.")
        }

        await findMatch.update({ homeScore, awayScore });

        return res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
})

router.post('/create', async (req, res) => {
    try {
        const { matches } = req.body;

        await Match.bulkCreate(matches)

        return res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
})

module.exports = router