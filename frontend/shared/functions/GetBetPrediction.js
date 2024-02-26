export const getBetPrediction = (bet) => {
    let predictionStr = bet.details.details.prediction.toString();
    predictionStr = predictionStr.replace('Over', '↑');
    predictionStr = predictionStr.replace('Under', '↓');

    switch (bet.details.type) {
        case 'Moneyline':
            return `${bet.details.details.prediction}${bet.details.details.includeDraw ? '/Draw' : ''}`;
        case 'Total':
            return `${predictionStr} ${bet.details.details.line}`;
        case 'Both Score':
            return bet.details.details.prediction ? 'Yes' : 'No';
        case 'Spread':
            return `${bet.details.details.prediction} ${bet.details.details.spread >= 0 ? '+' : ''}${bet.details.details.spread}`;
        case 'Player Prop':
            return `${bet.details.details.player} ${predictionStr}`;
        default:
            return predictionStr;
    }
}