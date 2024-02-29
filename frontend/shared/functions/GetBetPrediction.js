export const getBetPrediction = (type, prediction, details) => {
    let predictionStr = prediction.toString();
    predictionStr = predictionStr.replace('Over', '↑');
    predictionStr = predictionStr.replace('Under', '↓');

    switch (type) {
        case 'Moneyline':
            return `${prediction}${details.includeDraw ? '/Draw' : ''}`;
        case 'Total':
            return `${predictionStr} ${details.line}`;
        case 'Both Score':
            return prediction ? 'Both Score' : 'Not Both Score';
        case 'Spread':
            return `${prediction} ${details.spread >= 0 ? '+' : ''}${details.spread}`;
        case 'Player Prop':
            return `${details.player} ${predictionStr}`;
        default:
            return predictionStr;
    }
}