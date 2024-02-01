const BetService = require('../services/BetService');
const Bet = require('../models/Bet').Bet;
const Match = require('../models/Match').Match;
const Team = require('../models/Team').Team;
const BetMoneyline = require('../models/BetMoneyline').BetMoneyline;
const BetTotal = require('../models/BetTotal').BetTotal;
const moment = require('moment');
const { Op } = require('sequelize');
const { BetBothScore } = require('../models/BetBothScore');
const { League } = require('../models/League');
const { Parlay } = require('../models/Parlay');
const ConfigService = require('../services/ConfigService');

const list = async (req, res) => {
    try {
        const { page, league_id, bet_type } = req.query;

        match_conditions = {}
        bet_conditions = { value: { [Op.ne]: null } }

        if (league_id) {
            match_conditions['leagueId'] = league_id
        }

        if (bet_type) {
            bet_conditions['type'] = bet_type
        }

        const pageSize = 15

        const { count, rows } = await Bet.findAndCountAll({
            where: bet_conditions,
            include: [{ model: Match, as: 'match', where: match_conditions, include: [{ model: Team, as: 'homeTeam' }, { model: Team, as: 'awayTeam' }, { model: League, as: 'league' }] },
            { model: BetTotal, as: 'total' }, { model: BetMoneyline, as: 'moneyline' }, { model: BetBothScore, as: 'bothScore' }],
            offset: (page - 1) * pageSize, limit: pageSize, order: [
                [{ model: Match, as: 'match' }, 'matchDate', 'DESC'],
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
        return res.status(500).json({ data: 'An error has occured', error })
    }
};

const create = async (req, res) => {
    try {
        const newBet = await BetService.createBet()
        return res.json(newBet)
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ data: 'An error has occured', error })
    }
};

const update = async (req, res) => {
    const { id, matchId, value, odds, type, prediction, line } = req.body;

    try {
        const findBet = await Bet.findOne({ where: { id: id }, include: { all: true } })

        if (findBet == null) {
            return res.status(404).send("Bet not found.")
        }

        await findBet.update({ matchId, value, odds, type });

        switch (type) {
            case 'Moneyline':
                await findBet.moneyline.update({ prediction });
                break;
            case 'Spread':
                await findBet.moneyline.update({ prediction, spread });
                break;
            case 'Total':
                await findBet.total.update({ prediction, line });
                break;
            case 'BothScore':
                await findBet.bothScore.update({ prediction });
                break;
        }

        return res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ data: 'An error has occured', error })
    }
};

const remove = async (req, res) => {
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
        return res.status(500).json({ data: 'An error has occured', error })
    }
};

const dashboard = async (req, res) => {
    try {
        const bets = await Bet.findAll({
            include: [{
                model: Match, as: 'match',
                // where: {matchDate: {[Op.gte]: '2022-09-09'}}, 
                include: [{ model: Team, as: 'homeTeam' },
                { model: Team, as: 'awayTeam' }, { model: League, as: 'league' }]
            }, { model: BetTotal, as: 'total' }, { model: BetMoneyline, as: 'moneyline' }, { model: BetBothScore, as: 'bothScore' }], order: [
                [{ model: Match, as: 'match' }, 'matchDate', 'ASC'],
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
            }, { model: BetTotal, as: 'total' }, { model: BetMoneyline, as: 'moneyline' }, { model: BetBothScore, as: 'bothScore' }]
        }

        const parlays = await Parlay.findAll({
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
                backgroundColor: project_colors[i],
                borderColor: project_colors[i],
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
            totalDeposited: (await ConfigService.getDepositedValue()).data
        }

        for (let i = 0; i < bets.length; i++) {
            let betDate = moment.utc(bets[i].match.matchDate).format('DD-MM-YYYY')
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

            if (bets[i].type == 'Moneyline') {
                let team
                switch (bets[i].moneyline.prediction) {
                    case 'Home':
                        team = bets[i].match.homeTeam.name;
                        break;
                    case 'Away':
                        team = bets[i].match.awayTeam.name;
                        break;
                }

                if (!(team in profitByTeam)) profitByTeam[team] = 0
                if (bets[i].moneyline.prediction != 'Draw') profitByTeam[team] += betOutcomeValue
                proiftByOutcome[bets[i].moneyline.prediction] += betOutcomeValue
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
                    backgroundColor: project_colors,
                    borderColor: project_colors,
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
        return res.status(500).json({ data: 'An error has occured', error })
    }
};

module.exports = {
    list,
    create,
    update,
    remove,
    dashboard
}