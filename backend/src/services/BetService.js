const { Bet } = require('../models/Bet');
const { BetType } = require('../models/BetType');
const { BetDetails } = require('../models/BetDetails');

const createBet = async (bet, userEmail) => {
    let { value, odds, sport, league, teamA, teamB, eventDate, type, prediction, details, parlayId, won } = bet;

    const bet_type = await BetType.findOne({ where: { name: type } })
    if (!bet_type) {
        throw Error("Bet type does not exist.")
    }

    const newBet = await Bet.create({ sport, league, teamA, teamB, eventDate, parlayId, value, odds, type, won, createdByEmail: userEmail });

    const betId = newBet.id;

    details = { ...details, prediction }
    const detailsParsed = JSON.stringify(details)

    await BetDetails.create({ betId, type, details: detailsParsed })

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

const projectColors = [
    '#17408B', '#6594C0', '#38003c', '#0078AA', '#2B4865', '#dae025', '#41b883', '#774360', '#D3010C', '#9C9EFE', '#7DCE13', '#224B0C', '#fbec21', '#749F82', '#5837D0'
]

const checkBetOutcome = (bet, generalInfo, barChartInfo, chartInfo) => {
    let betOutcomeValue

    if (bet.won || bet.details.earlyPayout) {
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

module.exports = {
    updateBarChartColors,
    checkBetOutcome,
    projectColors,
    createBet
}