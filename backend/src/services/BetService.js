const Bet = require('../models/Bet').Bet;
const Match = require('../models/Match').Match;
const moment = require('moment');
const { BetDetails } = require('../models/BetDetails');
const {User} = require('../models/User')

const createBet = async (bet, userEmail) => {
    let { leagueId, homeTeamId, awayTeamId, date, value, odds, type, prediction, details, parlayId } = bet;

    date = moment(date).format();

    const match = await Match.findOne({ where: { leagueId, homeTeamId, awayTeamId, date } });

    const matchId = match.id;

    const newBet = await Bet.create({ matchId, parlayId, value, odds, type, createdByEmail: userEmail });

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

const updateUserBets = async (userEmail) => {
    const userBets = await Bet.findAll({
        where: {
            createdByEmail: userEmail,
            won: null,
        },
        include: [
            {
                model: BetDetails,
                required: true, // INNER JOIN
            },
            {
                model: Match,
                where: {
                    homeScore: { [Sequelize.Op.ne]: null },
                },
                required: true, // INNER JOIN
            },
        ],
    });

    for (let i = 0; i < userBets.length; i++) {
        details = JSON.parse(userBets[i].details.details)

        if (userBets[i].details.type == 'Moneyline' && ((homeScore > awayScore && details.prediction == 'Home') ||
            (homeScore < awayScore && details.prediction == 'Away') ||
            ((details.includeDraw || homeScore == awayScore) && details.prediction == 'Draw'))) {
            await userBets[i].update({ won: true })
        }
        else if (userBets[i].details.type == 'Total' && ((homeScore + awayScore > details.line && details.prediction == 'Over') ||
            (homeScore + awayScore < details.line && details.prediction == 'Under'))) {
            await userBets[i].update({ won: true })
        }
        else if (userBets[i].details.type == 'Total' && homeScore + awayScore == details.line) {
            await userBets[i].update({ push: true })
        }
        else if (userBets[i].details.type == 'BothScore' && ((homeScore && awayScore && details.prediction) ||
            (!homeScore && !awayScore && !details.prediction))) {
            await userBets[i].update({ won: true })
        }
        else if (userBets[i].details.type == 'Spread' && ((homeScore + details.spread > awayScore && details.prediction == 'Home') ||
            (homeScore < awayScore + details.spread && details.prediction == 'Away'))) {
            await userBets[i].update({ won: true })
        }
        else {
            await userBets[i].update({ won: false })
        }

        if (userBets[i].parlayId) {
            let parlay = await Parlay.findOne({ where: { id: userBets[i].parlayId }, include: { model: Bet, as: 'bets', include: { model: Match, as: 'match' } } })

            let won = parlay.won

            if (!parlay.bets.some(x => x.match.homeScore == null)) {
                won = false

                if (!parlay.bets.some(x => !x.won)) {
                    won = true
                }

                await parlay.update({ won })
            }
        }
    }
}

module.exports = {
    updateBarChartColors,
    checkBetOutcome,
    getParlayLeagues,
    updateUserBets,
    projectColors,
    createBet
}