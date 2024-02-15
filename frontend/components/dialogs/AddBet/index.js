import NumberField from "~/components/textFields/NumberField/index.vue";
import ValidationService from "~/services/ValidationService";
import { NumberFieldEnum } from "~/shared/enums/NumberFieldEnum";
import { bothScorePredictionOptions } from "~/shared/enums/BothScorePredictionOptions";
export default {
    name: 'AddBetDialog',
    components: { NumberField },
    computed: {
        total_prediction_options() {
            return [
                'Over',
                'Under'
            ]
        }
    },
    data: () => ({
        validationService: new ValidationService(),
        bet: {
            sport: null,
            league: null,
            teamA: null,
            teamB: null,
            eventDate: null,
            value: null,
            odds: null,
            type: 'Moneyline',
            prediction: null,
            details: {}
        },
        sport: null,
        league: null,
        bothScorePredictionOptions,
        loading: false,
        winnerPrediction: null,
        leagueOptions: [],
        teamOptions: [],
        numberFieldEnum: NumberFieldEnum
    }),
    props: {
        sportsChain: Array,
        betTypeOptions: Array
    },
    created() {
        this.bet.eventDate = this.$moment().format('YYYY-MM-DD')

        if (this.sportsChain.length === 1) {
            this.sport = this.sportsChain[0]
            this.sport_changed()
        }
    },
    methods: {
        bet_type_changed() {
            switch (this.bet.type) {
                case 'Total':
                    this.bet.details = {
                        line: null
                    }
                    break;
                case 'Spread':
                    this.bet.details = {
                        spread: null
                    }
                    break;
                default:
                    this.bet.details = {}
            }
        },
        winner_prediction_changed() {
            switch (this.winnerPrediction) {
                case this.bet.teamA:
                    this.bet.prediction = 'A'
                    break;
                case this.bet.teamB:
                    this.bet.prediction = 'B'
                    break;
                case 'Draw':
                    this.bet.prediction = 'C'
                    break;
            }
        },
        get_winner_options() {
            if (!this.league || !this.bet.teamA || !this.bet.teamB) {
                return []
            }
            return [
                this.bet.teamA,
                this.bet.teamB,
                'Draw',
            ]
        },
        sport_changed(sport) {
            this.leagueOptions = sport.leagues;
            if (this.leagueOptions.length == 1) {
                this.league = this.leagueOptions[0]
            } else {
                this.league = null
            }

            this.league_changed()
        },
        league_changed() {
            this.bet.teamA = null
            this.bet.teamB = null

            this.teamOptions = []
            if (this.league) {
                this.teamOptions = this.league.teams;
            }
        },
        async submit() {
            const result = this.$refs.form.validate();
            if (!result) {
                return;
            }
            this.loading = true

            this.bet.sport = this.sport.name
            this.bet.league = this.league.name

            await this.$axios.post(`bet/create`,
                { ...this.bet, details: JSON.stringify(this.bet.details) })
                .then((resp) => {
                    this.$emit('added')
                });
            this.loading = false
        }
    }
}