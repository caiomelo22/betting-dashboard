import GeneralServices from "~/services/GeneralServices"
import { get_bet_prediction } from "~/shared/functions/GetBetPrediction";
export default {
    name: 'ParlayDetailsDialog',
    props: {
        parlay: Object
    },
    computed: {
        bets_headers() {
            return [
                'Date', 'League', 'Matchup', 'Bet Type', 'Prediction', 'Odds', 'Won'
            ]
        }
    },
    data: () => ({
        generalServices: new GeneralServices()
    }),
    methods: {
        get_bet_prediction
    }
}