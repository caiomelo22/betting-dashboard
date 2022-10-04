export const get_bet_prediction = (bet) => {
    switch (bet.type) {
        case 'Moneyline':
            return bet.moneyline.prediction;
        case 'Total':
            return bet.total.prediction;
        case 'BothScore':
            return bet.bothScore.prediction ? 'Yes' : 'No';
    }
}