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

        let i, j
        for(i = 0; i < rows.length; i++)
        {
            for(j = 0; j < rows[i].bets.length; j++)
            {
                rows[i].bets[j].details.details = JSON.parse(rows[i].bets[j].details.details)
            }
        }

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
    let { value, odds, date, bets, sportsbook, won, payout, push } = req.body;

    try {
        date = moment(date).format();

        if (won && !payout) {
            payout = odds * value
        }

        const parlay = await Parlay.create({ value, odds, date, sportsbook, won, payout, push, createdByEmail: req.user.email })

        for (let i = 0; i < bets.length; i++) {
            await BetService.createBet({ ...bets[i], parlayId: parlay.id, sportsbook, value: null, odds: null }, req.user.email)
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

router.put('/update/:parlayId', async (req, res) => {
    const { parlayId } = req.params
    let { value, odds, date, bets, sportsbook, won, payout, push } = req.body;

    try {
        date = moment(date).format();

        if (won && !payout) {
            payout = odds * value
        }

        const findParlay = await Parlay.findOne({ where: { id: parlayId, createdByEmail: req.user.email } })
        
        await findParlay.update({ value, odds, date, sportsbook, won, payout, push })

        // Fetch existing bets associated with the parlay
        const existingBets = await findParlay.getBets();

        // Delete bets that are not present in the updated array
        for (let i = 0; i < existingBets.length; i++) {
            const existingBet = existingBets[i];
            const betIndex = bets.findIndex(bet => bet.id === existingBet.id);
            if (betIndex === -1) {
                // Delete the bet as it's not present in the updated array
                await existingBet.destroy();
            } else {
                // Update the bet if it's present in the updated array
                await BetService.updateBet(bets[betIndex].id, { ...bets[betIndex], sportsbook, value: null, odds: null }, req.user.email)
            }
        }

        const newBets = bets.filter(x => !x.id)
        for (let i = 0; i < newBets.length; i++) {
            await BetService.createBet({ ...newBets[i], parlayId, sportsbook, value: null, odds: null }, req.user.email)
        }

        return res.sendStatus(204)
    } catch (error) {
        if (error.message == "Bet type does not exist.")
        {
            return res.status(400).send(error.message)
        }

        console.log(error)
        return res.status(500).send(error.message)
    }
})

router.delete('/delete/:parlayId', async (req, res) => {
    try {
        const { parlayId } = req.params

        const findParlay = await Parlay.findOne({ where: { id: parlayId, createdByEmail: req.user.email } })
        if (!findParlay) {
            return res.status(400).send("Parlay not found.")
        }

        await findParlay.destroy()

        return res.sendStatus(204)
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})

module.exports = router