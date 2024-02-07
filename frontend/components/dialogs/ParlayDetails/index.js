import GeneralServices from "~/services/GeneralServices"
import { getBetPrediction } from "~/shared/functions/GetBetPrediction";
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
        getBetPrediction
    }
}