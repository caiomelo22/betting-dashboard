import GeneralServices from "~/services/GeneralServices"
export default {
    name: 'ParlayDetailsDialog',
    props: {
        parlay: Object
    },
    computed: {
        bets_headers() {
            return [
                'Date', 'League', 'Matchup', 'Prediction', 'Odds', 'Won'
            ]
        }
    },
    data: () => ({
        generalServices: new GeneralServices()
    }),
    methods: {
    get_bet_prediction(bet) {
        switch (bet.type) {
          case 'Moneyline':
            return bet.moneyline.prediction;
          case 'Total':
            return bet.total.prediction;
        }
      },
    }
}