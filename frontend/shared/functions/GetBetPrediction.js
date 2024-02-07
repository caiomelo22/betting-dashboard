export const getBetPrediction = (bet) => {
    switch (bet.details.type) {
        case 'Moneyline':
            return `${bet.details.details.prediction}${bet.details.details.includeDraw ? '/Draw' : ''}`;
        case 'Total':
            return `${bet.details.details.prediction} ${bet.details.details.line}`;
        case 'BothScore':
            return bet.details.details.prediction ? 'Yes' : 'No';
        case 'Spread':
            return `${bet.details.details.prediction} ${bet.details.details.spread >= 0 ? '+' : ''}${bet.details.details.spread}`;
        default:
            return bet.details.details.prediction;
    }
}