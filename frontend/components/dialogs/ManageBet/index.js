import NumberField from "~/components/textFields/NumberField/index.vue";
import ValidationService from "~/services/ValidationService";
import { NumberFieldEnum } from "~/shared/enums/NumberFieldEnum";
import { bothScorePredictionOptions } from "~/shared/enums/BothScorePredictionOptions";
export default {
    name: 'ManageBetDialog',
    components: { NumberField },
    computed: {
        total_prediction_options() {
            return [
                'Over',
                'Under'
            ]
        },
        won_options() {
            return [
                { text: "Pending", value: null },
                { text: "Yes", value: true },
                { text: "No", value: false },
            ]
        }
    },
    data: () => ({
        validationService: new ValidationService(),
        editing: false,
        bet: {
            sport: null,
            league: null,
            teamA: null,
            teamB: null,
            eventDate: null,
            value: null,
            odds: null,
            type: 'Moneyline',
            push: false,
            prediction: null,
            won: null,
            earlyPayout: false,
            details: {}
        },
        selectedSport: null,
        selectedLeague: null,
        bothScorePredictionOptions,
        loading: false,
        winnerPrediction: null,
        leagueOptions: [],
        teamOptions: [],
        numberFieldEnum: NumberFieldEnum
    }),
    props: {
        betProp: Object,
        sportsChain: Array,
        betTypeOptions: Array
    },
    created() {
        if (this.betProp) {
            this.bet = {
                ...this.betProp,
                prediction: this.betProp.details.details.prediction,
                earlyPayout: this.betProp.details.earlyPayout,
                details: this.betProp.details.details
            }

            const sportIndex = this.sportsChain.map(x => x.name).indexOf(this.bet.sport)
            this.selectedSport = this.sportsChain[sportIndex]
            this.sport_changed()

            this.editing = true
        } else {
            this.bet.eventDate = this.$moment().format('YYYY-MM-DD')

            if (this.sportsChain.length === 1) {
                this.selectedSport = this.sportsChain[0]
                this.bet.sport = this.selectedSport.name
                this.sport_changed()
            }
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
            if (!this.bet.league || !this.bet.teamA || !this.bet.teamB) {
                return []
            }
            return [
                this.bet.teamA,
                this.bet.teamB,
                'Draw',
            ]
        },
        sport_changed() {
            this.league = null
            this.leagueOptions = []

            const sportIndex = this.sportsChain.map(x => x.name).indexOf(this.bet.sport)

            if (sportIndex != -1) {
                this.selectedSport = this.sportsChain[sportIndex]

                this.leagueOptions = this.selectedSport.leagues;
                if (this.leagueOptions.length == 1) {
                    this.bet.league = this.leagueOptions[0].name
                }
            } else {
                this.selectedSport = null
            }

            this.league_changed()
        },
        league_changed() {
            this.bet.teamA = null
            this.bet.teamB = null
            this.teamOptions = []

            if (this.leagueOptions) {
                const leagueIndex = this.leagueOptions.map(x => x.name).indexOf(this.bet.league)

                if (leagueIndex != -1) {
                    this.selectedLeague = this.leagueOptions[leagueIndex]

                    this.teamOptions = this.selectedLeague.teams;
                }
            }
        },
        async submit() {
            const result = this.$refs.form.validate();
            if (!result) {
                return;
            }
            this.loading = true

            await this.$axios.post(`bet/create`,
                { ...this.bet, details: JSON.stringify(this.bet.details) })
                .then((resp) => {
                    this.$emit('added')
                });
            this.loading = false
        }
    }
}