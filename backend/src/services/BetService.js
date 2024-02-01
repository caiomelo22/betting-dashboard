const Bet = require('../models/Bet').Bet;
const Match = require('../models/Match').Match;
const BetMoneyline = require('../models/BetMoneyline').BetMoneyline;
const BetTotal = require('../models/BetTotal').BetTotal;
const moment = require('moment');
const { BetBothScore } = require('../models/BetBothScore');

const createBet = async (bet) => {
    let { leagueId, homeTeamId, awayTeamId, matchDate, value, odds, type, prediction, line, spread, parlayId } = bet;

    let match = null;

    matchDate = moment(matchDate).format();

    match = await Match.findOne({ where: { leagueId, homeTeamId, awayTeamId, matchDate } });

    if (!match) {
        match = await Match.create({ leagueId, homeTeamId, awayTeamId, matchDate });
    }

    const matchId = match.id;

    const newBet = await Bet.create({ matchId, parlayId, value, odds, type });

    const betId = newBet.id;

    switch (type) {
        case 'Moneyline':
            newBet.moneyline = await BetMoneyline.create({ betId, prediction });
            break;
        case 'Spread':
            newBet.moneyline = await BetMoneyline.create({ betId, prediction, spread });
            break;
        case 'Total':
            newBet.total = await BetTotal.create({ betId, prediction, line });
            break;
        case 'BothScore':
            newBet.bothScore = await BetBothScore.create({ betId, prediction });
            break;
    }

    return newBet
}

const updateBarChartColors = (barChartInfo) => {
    if (barChartInfo.datasets[0].data[barChartInfo.datasets[0].data.length - 1] >= 0) {
        barChartInfo.datasets[0].backgroundColor.push('#41b883')
        barChartInfo.datasets[0].borderColor.push('#41b883')
    } else if (barChartInfo.datasets[0].data[barChartInfo.datasets[0].data.length - 1] < 0) {
        barChartInfo.datasets[0].backgroundColor.push('#990000')
        barChartInfo.datasets[0].borderColor.push('#990000')
    }
}

const project_colors = [
    '#17408B', '#6594C0', '#38003c', '#0078AA', '#2B4865', '#dae025', '#41b883', '#774360', '#D3010C', '#9C9EFE', '#7DCE13', '#224B0C', '#fbec21', '#749F82', '#5837D0'
]

const checkBetOutcome = (bet, generalInfo, barChartInfo, chartInfo) => {
    let betOutcomeValue
    if (bet.won || bet.earlyPayout) {
        generalInfo.totalGreens += 1
        betOutcomeValue = bet.value * bet.odds - bet.value
    }
    else if (bet.push) {
        betOutcomeValue = 0
    } else {
        generalInfo.totalReds += 1
        betOutcomeValue = -bet.value
    }

    generalInfo.totalProfit += betOutcomeValue
    barChartInfo.datasets[0].data[barChartInfo.datasets[0].data.length - 1] += betOutcomeValue
    chartInfo.datasets[0].data[chartInfo.datasets[0].data.length - 1] += betOutcomeValue

    return betOutcomeValue
}

const getParlayLeagues = (parlay) => {
    return [...new Set(parlay.bets.map(x => x.match.league.id))]
}

module.exports = {
    updateBarChartColors,
    checkBetOutcome,
    getParlayLeagues,
    createBet
}