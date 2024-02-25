const { Bet } = require('../models/Bet');
const { BetType } = require('../models/BetType');
const { BetDetails } = require('../models/BetDetails');

const createBet = async (bet, userEmail) => {
    let { payout, value, odds, sport, league, teamA, teamB, sportsbook, date, type, prediction, details, parlayId, won, push, earlyPayout } = bet;

    details = details ? JSON.parse(details) : {}

    const bet_type = await BetType.findOne({ where: { name: type } })
    if (!bet_type) {
        throw Error("Bet type does not exist.")
    }

    if (won && !payout) {
        payout = odds * value
    }

    const newBet = await Bet.create({ sport, league, teamA, teamB, sportsbook, date, parlayId, value, odds, payout, type, won, push, createdByEmail: userEmail });

    const betId = newBet.id;

    details = { ...details, prediction }
    const detailsParsed = JSON.stringify(details)

    await BetDetails.create({ betId, type, details: detailsParsed, earlyPayout })

    return newBet
}

const updateBet = async (betId, bet, userEmail) => {
    let { payout, value, odds, sport, league, teamA, teamB, sportsbook, date, type, prediction, details, won, push, earlyPayout } = bet;

    details = details ? JSON.parse(details) : {}

    const findBet = await Bet.findOne({ where: { id: betId, createdByEmail: userEmail } })

    if (findBet == null) {
        throw Error("Bet not found.")
    }

    if (won && !payout) {
        payout = odds * value
    }

    await findBet.update({ payout, value, odds, sport, league, teamA, teamB, sportsbook, date, won, push });

    const detailsObj = await BetDetails.findOne({ where: { betId: findBet.id } })

    const updatedDetails = { ...details, prediction }

    await detailsObj.update({ details: JSON.stringify(updatedDetails), type, earlyPayout })
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

    if (bet.won) {
        generalInfo.totalGreens += 1
        betOutcomeValue = bet.payout - bet.value
    }
    else if (bet.push) {
        betOutcomeValue = bet.payout
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
    updateBet,
    createBet
}