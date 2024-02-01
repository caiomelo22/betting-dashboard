const Bet = require('../models/Bet').Bet;
const Match = require('../models/Match').Match;
const Team = require('../models/Team').Team;
const { Parlay } = require('../models/Parlay')
const BetMoneyline = require('../models/BetMoneyline').BetMoneyline;
const BetTotal = require('../models/BetTotal').BetTotal;
const moment = require('moment');
const { League } = require('../models/League');
const { create_bet } = require('./BetService');
const { BetBothScore } = require('../models/BetBothScore');

const list = async (req, res) => {
    try {
        const page = parseInt(req.query.page);

        const pageSize = 15

        const include = {
            model: Bet,
            as: 'bets',
            include: [{
                model: Match, as: 'match', include: [
                    { model: Team, as: 'homeTeam' },
                    { model: Team, as: 'awayTeam' },
                    { model: League, as: 'league' }]
            }, { model: BetTotal, as: 'total' }, { model: BetMoneyline, as: 'moneyline' }, { model: BetBothScore, as: 'bothScore' }]
        }

        const { count, rows } = await Parlay.findAndCountAll({
            include, offset: (page - 1) * pageSize, limit: pageSize, order: [
                ['date', 'DESC'],
                ['updatedAt', 'DESC'],
            ],
        });

        const totalPages = Math.ceil(count / pageSize);

        const returnObject = {
            totalPages,
            parlays: rows
        }

        return res.json(returnObject)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ data: 'An error has occured', error })
    }
};

const create = async (req, res) => {
    let { value, odds, date, bets } = req.body;

    try {

        date = moment(date).format();

        const parlay = await Parlay.create({ value, odds, date })

        for (let i = 0; i < bets.length; i++) {
            let response = await create_bet({...bets[i], parlayId: parlay.id, matchDate: date})
            if (response.statusCode != 200) { return response }
        }

        return res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ data: 'An error has occured', error })
    }
};

module.exports = {
    list,
    create,
}