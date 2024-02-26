const getParlaySports = (parlay) => {
    return [...new Set(parlay.bets.map(x => x.sport))]
}

const getParlayLeagues = (parlay) => {
    return [...new Set(parlay.bets.map(x => x.league))]
}

module.exports = {
    getParlaySports,
    getParlayLeagues
}