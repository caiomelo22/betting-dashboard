const BetService = require('../services/BetService');
const Bet = require('../models/Bet').Bet;
const Match = require('../models/Match').Match;
const Team = require('../models/Team').Team;
const moment = require('moment');
const { Op } = require('sequelize');
const { League } = require('../models/League');
const { User } = require('../models/User');
const { Parlay } = require('../models/Parlay');
const { BetDetails } = require('../models/BetDetails');
const express = require('express');

const router = express.Router();

router.get('/list', async (req, res) => {
    try {
        const { page, leagueId, betType } = req.query;

        matchConditions = {}
        betConditions = { createdByEmail: req.user.email, value: { [Op.ne]: null } }

        if (leagueId) {
            matchConditions['leagueId'] = leagueId
        }

        if (betType) {
            betConditions['type'] = betType
        }

        const pageSize = 15

        const { count, rows } = await Bet.findAndCountAll({
            where: betConditions,
            include: [{ model: Match, as: 'match', where: matchConditions, include: [{ model: Team, as: 'homeTeam' }, { model: Team, as: 'awayTeam' }, { model: League, as: 'league' }] },
            { model: BetDetails, as: 'details' }],
            offset: (page - 1) * pageSize, limit: pageSize, order: [
                [{ model: Match, as: 'match' }, 'date', 'DESC'],
                ['updatedAt', 'DESC'],
            ],
        });

        const totalPages = Math.ceil(count / pageSize);

        const returnObject = {
            totalPages,
            bets: rows
        }

        return res.json(returnObject)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
})

router.post('/create', async (req, res) => {
    try {
        const newBet = await BetService.createBet(req.body, req.user.email)
        return res.json(newBet)
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
})

router.put('/update', async (req, res) => {
    const { id, matchId, value, odds, type, prediction, details } = req.body;

    try {
        const findBet = await Bet.findOne({ where: { id: id }, include: { all: true } })

        if (findBet == null) {
            return res.status(404).send("Bet not found.")
        }

        await findBet.update({ matchId, value, odds });

        const detailsObj = await BetDetails.findOne({ where: { id: findBet.id } })

        const updatedDetails = { ...details, prediction }

        await detailsObj.update({ details: updatedDetails, type })

        return res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
})

router.delete('/remove', async (req, res) => {
    const { id } = req.body;

    try {
        const findBet = await Bet.findOne({ where: { id: id } })

        if (findBet == null) {
            return res.status(404).send("Bet not found.")
        }

        await findBet.destroy();

        return res.sendStatus(204)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error })
    }
})

router.get('/dashboard', async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.user.email } })

        const bets = await Bet.findAll({
            where: { createdByEmail: req.user.email },
            include: [{
                model: Match, as: 'match',
                include: [{ model: Team, as: 'homeTeam' },
                { model: Team, as: 'awayTeam' }, { model: League, as: 'league' }]
            }, { model: BetDetails, as: 'details' }], order: [
                [{ model: Match, as: 'match' }, 'date', 'ASC'],
                ['createdAt', 'DESC'],
            ],
        });

        const parlayInclude = {
            model: Bet,
            as: 'bets',
            include: [{
                model: Match, as: 'match', include: [
                    { model: Team, as: 'homeTeam' },
                    { model: Team, as: 'awayTeam' },
                    { model: League, as: 'league' }]
            }, { model: BetDetails, as: 'details' }]
        }

        const parlays = await Parlay.findAll({
            where: { createdByEmail: req.user.email },
            include: parlayInclude, order: [
                ['date', 'ASC'],
                ['createdAt', 'DESC'],
            ],
        });

        const leagues = await League.findAll();

        let labels = []

        let leagueChartInfo = {
            labels: [],
            datasets: []
        }

        for (let i = 0; i < leagues.length; i++) {
            leagueChartInfo.datasets.push({
                label: leagues[i].name,
                leagueId: leagues[i].id,
                hidden: leagues[i].inactive,
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
            'Home': 0,
            'Draw': 0,
            'Away': 0,
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
            let betDate = moment.utc(bets[i].match.date).format('DD-MM-YYYY')
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

                let dateParlays = parlays.filter(x => moment(x.date).format('DD-MM-YYYY') == betDate)
                for (let j = 0; j < dateParlays.length; j++) {
                    const parlayValue = BetService.checkBetOutcome(dateParlays[j], generalInfo, barChartInfo, chartInfo)
                    const parlayLeagues = BetService.getParlayLeagues(dateParlays[j])
                    if (parlayLeagues.length == 1) {
                        const index = leagueChartInfo.datasets.map(x => x.leagueId).indexOf(parlayLeagues[0])
                        leagueChartInfo.datasets[index].data[leagueChartInfo.datasets[index].data.length - 1] += parlayValue
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
                    case 'Home':
                        team = bets[i].match.homeTeam.name;
                        break;
                    case 'Away':
                        team = bets[i].match.awayTeam.name;
                        break;
                }

                if (!(team in profitByTeam)) profitByTeam[team] = 0
                if (details.prediction != 'Draw') profitByTeam[team] += betOutcomeValue
                proiftByOutcome[details] += betOutcomeValue
            }

            const index = leagueChartInfo.datasets.map(x => x.leagueId).indexOf(bets[i].match.leagueId)
            leagueChartInfo.datasets[index].data[leagueChartInfo.datasets[index].data.length - 1] += betOutcomeValue

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

        leagueChartInfo.labels = labels
        barChartInfo.labels = labels
        chartInfo.labels = labels

        leagueChartInfo.datasets = leagueChartInfo.datasets.map(x => {
            x.hidden = x.data[x.data.length - 1] == 0 || x.hidden
            return x
        })

        const data = { chartInfo, generalInfo, barChartInfo, leagueChartInfo, teamChartInfo, outcomeChartInfo }

        return res.json(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
})

module.exports = router