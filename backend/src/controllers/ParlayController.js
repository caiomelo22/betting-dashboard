const Bet = require('../models/Bet').Bet;
const { Parlay } = require('../models/Parlay')
const moment = require('moment');
const BetService = require('../services/BetService');
const { BetDetails } = require('../models/BetDetails');
const express = require('express');
const { authenticate } = require('../middleware/Auth')

const router = express.Router();

router.use(authenticate)

router.get('/list', async (req, res) => {
    try {
        const page = parseInt(req.query.page);

        const pageSize = 15

        const include = {
            model: Bet,
            as: 'bets',
            include: [{ model: BetDetails, as: 'details' }]
        }

        const { count, rows } = await Parlay.findAndCountAll({
            where: { createdByEmail: req.user.email },
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
        return res.status(500).send(error.message)
    }
})

router.post('/create', async (req, res) => {
    let { value, odds, date, bets } = req.body;

    try {
        date = moment(date).format();

        const parlay = await Parlay.create({ value, odds, date, createdByEmail: req.user.email })

        for (let i = 0; i < bets.length; i++) {
            await BetService.createBet({ ...bets[i], parlayId: parlay.id, date: date }, req.user.email)
        }

        return res.json(parlay)
    } catch (error) {
        if (error.message == "Bet type does not exist.")
        {
            return res.status(400).send(error.message)
        }

        console.log(error)
        return res.status(500).send(error.message)
    }
})

module.exports = router