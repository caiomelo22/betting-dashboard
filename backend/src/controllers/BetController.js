const BetService = require('../services/BetService');
const Bet = require('../models/Bet').Bet;
const { getUserDistinctLeagues, getUserDistinctSports, getUserSportsChain } = require('../database/functions')
const moment = require('moment');
const { Op } = require('sequelize');
const { User } = require('../models/User');
const { Parlay } = require('../models/Parlay');
const { BetDetails } = require('../models/BetDetails');
const express = require('express');
const { authenticate } = require('../middleware/Auth')

const router = express.Router();

router.use(authenticate)

router.get('/list', async (req, res) => {
    try {
        const { page = 1, league, sport, betType } = req.query;

        betConditions = { createdByEmail: req.user.email, value: { [Op.ne]: null } }
        detailsConditions = {}

        if (league) {
            betConditions['league'] = league
        }

        if (sport) {
            betConditions['sport'] = sport
        }

        if (betType) {
            detailsConditions['type'] = betType
        }

        const pageSize = 20

        const { count, rows } = await Bet.findAndCountAll({
            where: betConditions,
            include: [{ model: BetDetails, as: 'details', where: detailsConditions }],
            offset: (page - 1) * pageSize, limit: pageSize, order: [
                ['eventDate', 'DESC'],
                ['updatedAt', 'DESC'],
            ],
        });

        for (let i = 0; i < rows.length; i++) {
            rows[i].details.details = JSON.parse(rows[i].details.details)
        }

        const totalPages = Math.ceil(count / pageSize);

        const returnObject = {
            totalPages,
            bets: rows
        }

        return res.json(returnObject)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})

router.post('/create', async (req, res) => {
    try {
        const newBet = await BetService.createBet(req.body, req.user.email)
        return res.json(newBet)
    }
    catch (error) {
        if (error.message == "Bet type does not exist.") {
            return res.status(400).send(error.message)
        }

        console.log(error)
        return res.status(500).send(error.message)
    }
})

router.put('/update/:betId', async (req, res) => {
    const { betId } = req.params
    let { value, odds, sport, league, teamA, teamB, eventDate, type, prediction, details, won, push, earlyPayout  } = req.body;

    try {
        details = details ? JSON.parse(details) : {}

        const findBet = await Bet.findOne({ where: { id: betId }, include: { all: true } })

        if (findBet == null) {
            return res.status(404).send("Bet not found.")
        }

        await findBet.update({ value, odds, sport, league, teamA, teamB, eventDate, won, push });

        const detailsObj = await BetDetails.findOne({ where: { betId: findBet.id } })

        const updatedDetails = { ...details, prediction }

        await detailsObj.update({ details: JSON.stringify(updatedDetails), type, earlyPayout })

        return res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})

router.delete('/remove/:betId', async (req, res) => {
    const { betId } = req.params;

    try {
        const findBet = await Bet.findOne({ where: { id: betId } })

        if (findBet == null) {
            return res.status(404).send("Bet not found.")
        }

        await findBet.destroy();

        return res.sendStatus(204)
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message)
    }
})

router.get('/dashboard', async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.user.email } })

        const bets = await Bet.findAll({
            where: { createdByEmail: req.user.email },
            include: [{ model: BetDetails, as: 'details' }], order: [
                ['eventDate', 'ASC'],
                ['createdAt', 'DESC'],
            ],
        });

        const parlayInclude = {
            model: Bet,
            as: 'bets',
            include: [{ model: BetDetails, as: 'details' }]
        }

        const parlays = await Parlay.findAll({
            where: { createdByEmail: req.user.email },
            include: parlayInclude, order: [
                ['date', 'ASC'],
                ['createdAt', 'DESC'],
            ],
        });

        const leagues = await getUserDistinctLeagues(req.user.email);
        const sports = await getUserDistinctSports(req.user.email);

        let labels = []

        let leagueChartInfo = {
            labels: [],
            datasets: []
        }

        let sportChartInfo = {
            labels: [],
            datasets: []
        }

        let i
        for (i = 0; i < sports.length; i++) {
            sportChartInfo.datasets.push({
                label: sports[i],
                hidden: false,
                fill: false,
                backgroundColor: BetService.projectColors[i],
                borderColor: BetService.projectColors[i],
                data: []
            })
        }

        for (i = 0; i < leagues.length; i++) {
            leagueChartInfo.datasets.push({
                label: leagues[i],
                hidden: false,
                fill: false,
                backgroundColor: BetService.projectColors[i],
                borderColor: BetService.projectColors[i],
                data: []
            })
        }

        // Inicializando a estrutura base do gráfico utilizada pelo ChartJS
        let chartInfo = {
            labels: [],
            datasets: [
                {
                    label: 'Progression',
                    fill: false,
                    backgroundColor: '#41b883',
                    borderColor: '#41b883',
                    data: []
                },
                {
                    label: 'Moving Average',
                    fill: false,
                    backgroundColor: '#9C9EFE',
                    borderColor: '#9C9EFE',
                    data: []
                },
            ]
        }

        let barChartInfo = {
            labels: [],
            datasets: [
                {
                    label: 'Profit by Day',
                    fill: false,
                    backgroundColor: [],
                    borderColor: [],
                    data: []
                },
            ]
        }

        let profitByTeam = {}
        let proiftByOutcome = {
            'A': 0,
            'B': 0,
            'C': 0,
        }

        const validBets = bets.filter(x => x.value)
        let generalInfo = {
            avgOdds: (validBets.reduce((prev, curr) => prev + curr.odds, 0)) / validBets.length,
            totalBet: 0,
            totalProfit: 0,
            totalGreens: 0,
            totalReds: 0,
            totalDeposited: user.totalDeposited
        }

        for (let i = 0; i < bets.length; i++) {
            let betDate = moment.utc(bets[i].eventDate).format('DD-MM-YYYY')
            if (labels[labels.length - 1] != betDate) {

                BetService.updateBarChartColors(barChartInfo)

                labels.push(betDate)

                chartInfo.datasets[0].data.push(generalInfo.totalProfit)
                barChartInfo.datasets[0].data.push(0)

                const last5Profit = chartInfo.datasets[0].data.slice(-5).reduce((acc, val) => acc + val);
                const last5Length = chartInfo.datasets[0].data.slice(-5).length
                movingAvg = last5Profit / last5Length
                chartInfo.datasets[1].data.push(movingAvg)

                for (let j = 0; j < leagues.length; j++) {
                    leagueChartInfo.datasets[j].data.push(leagueChartInfo.datasets[j].data[leagueChartInfo.datasets[j].data.length - 1] || 0)
                }

                for (let j = 0; j < sports.length; j++) {
                    sportChartInfo.datasets[j].data.push(sportChartInfo.datasets[j].data[sportChartInfo.datasets[j].data.length - 1] || 0)
                }

                let dateParlays = parlays.filter(x => moment(x.date).format('DD-MM-YYYY') == betDate)
                for (let j = 0; j < dateParlays.length; j++) {
                    const parlayValue = BetService.checkBetOutcome(dateParlays[j], generalInfo, barChartInfo, chartInfo)

                    const parlaySports = BetService.getBetsSports(dateParlays[j].bets)

                    if (parlaySports.length == 1) {
                        const index = sportChartInfo.datasets.map(x => x.leagueId).indexOf(parlaySports[0])
                        sportChartInfo.datasets[index].data[sportChartInfo.datasets[index].data.length - 1] += parlayValue

                        const parlayLeagues = BetService.getBetsLeagues(dateParlays[j].bets)

                        if (parlayLeagues.length == 1) {
                            const index = leagueChartInfo.datasets.map(x => x.leagueId).indexOf(parlayLeagues[0])
                            leagueChartInfo.datasets[index].data[leagueChartInfo.datasets[index].data.length - 1] += parlayValue
                        }
                    }
                }
            }

            if (bets[i].value == null) {
                continue
            }

            generalInfo.totalBet += bets[i].value

            betOutcomeValue = BetService.checkBetOutcome(bets[i], generalInfo, barChartInfo, chartInfo)

            if (bets[i].details.type == 'Moneyline') {
                const details = JSON.parse(bets[i].details.details)

                let team
                switch (details.prediction) {
                    case 'A':
                        team = bets[i].teamA;
                        break;
                    case 'B':
                        team = bets[i].teamB;
                        break;
                }

                if (!(team in profitByTeam)) profitByTeam[team] = 0
                if (details.prediction != 'C') profitByTeam[team] += betOutcomeValue
                proiftByOutcome[details.prediction] += betOutcomeValue
            }

            const leagueIndex = leagueChartInfo.datasets.map(x => x.label).indexOf(bets[i].league)
            leagueChartInfo.datasets[leagueIndex].data[leagueChartInfo.datasets[leagueIndex].data.length - 1] += betOutcomeValue

            const sportIndex = sportChartInfo.datasets.map(x => x.label).indexOf(bets[i].sport)
            sportChartInfo.datasets[sportIndex].data[sportChartInfo.datasets[sportIndex].data.length - 1] += betOutcomeValue
        }

        let teamChartInfo = {
            labels: [],
            datasets: [
                {
                    label: 'Profit by Team',
                    fill: false,
                    backgroundColor: [],
                    borderColor: [],
                    data: []
                },
            ]
        }

        for (let team in Object.entries(profitByTeam)
            .sort(([, a], [, b]) => a - b)
            .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})) {
            if (profitByTeam[team]) {
                teamChartInfo.labels.push(team)
                teamChartInfo.datasets[0].data.push(profitByTeam[team])
                BetService.updateBarChartColors(teamChartInfo)
            }
        }

        let outcomeChartInfo = {
            labels: [],
            datasets: [
                {
                    label: 'Profit by Outcome',
                    backgroundColor: BetService.projectColors,
                    borderColor: BetService.projectColors,
                    data: []
                },
            ]
        }

        for (let outcome in Object.entries(proiftByOutcome)
            .sort(([, a], [, b]) => a - b)
            .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})) {
            outcomeChartInfo.labels.push(outcome)
            outcomeChartInfo.datasets[0].data.push(proiftByOutcome[outcome])
        }

        BetService.updateBarChartColors(barChartInfo)

        sportChartInfo.labels = labels
        leagueChartInfo.labels = labels
        barChartInfo.labels = labels
        chartInfo.labels = labels

        leagueChartInfo.datasets = leagueChartInfo.datasets.map(x => {
            x.hidden = x.data[x.data.length - 1] == 0 || x.hidden
            return x
        })

        sportChartInfo.datasets = sportChartInfo.datasets.map(x => {
            x.hidden = x.data[x.data.length - 1] == 0 || x.hidden
            return x
        })

        const data = { chartInfo, generalInfo, barChartInfo, leagueChartInfo, sportChartInfo, teamChartInfo, outcomeChartInfo }

        return res.json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})

router.put('/update-outcome/:betId', async (req, res) => {
    try {
        const { betId } = req.params
        const { won } = req.body

        const bet = await Bet.findOne({ where: { id: betId } })

        if (!bet) {
            return res.status(404).send("Bet not found.")
        }

        await bet.update({won})

        return res.sendStatus(204)
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})

router.get('/leagues/list', async (req, res) => {
    try {
        const data = await getUserDistinctLeagues(req.user.email)

        return res.json(data)
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})

router.get('/sports-chain', async (req, res) => {
    try {
        const data = await getUserSportsChain(req.user.email)

        return res.json(data)
    }
    catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})

module.exports = router