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
        bet: {
            sport: null,
            league: null,
            teamA: null,
            teamB: null,
            sportsbook: null,
            date: null,
            value: null,
            odds: null,
            type: 'Moneyline',
            push: false,
            prediction: null,
            won: null,
            payout: null,
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
        sportsbookOptions: Array,
        betTypeOptions: Array
    },
    created() {
        if (this.betProp) {
            this.bet = {
                ...this.betProp,
                type: this.betProp.details.type,
                prediction: this.betProp.details.details.prediction,
                earlyPayout: this.betProp.details.earlyPayout,
                details: this.betProp.details.details
            }

            this.bet.date = this.bet.date.split('T')[0]

            this.initializeOptionsFromBetProp()
        } else {
            this.bet.date = this.$moment().format('YYYY-MM-DD')

            if (this.sportsChain.length === 1) {
                this.selectedSport = this.sportsChain[0]
                this.bet.sport = this.selectedSport.name
                this.sport_changed()
            }
        }
    },
    methods: {
        updateBetPayout() {
            if (this.bet.won) {
                this.bet.payout = parseFloat((this.bet.odds * this.bet.value).toFixed(2))
            } else {
                this.bet.payout = 0
            }
        },
        betOddsChanged(value) {
            this.bet.odds = value

            this.updateBetPayout()
        },
        betValueChanged(value) {
            this.bet.value = value

            this.updateBetPayout()
        },
        initializeOptionsFromBetProp() {
            const sportIndex = this.sportsChain.map(x => x.name).indexOf(this.bet.sport)
            this.selectedSport = this.sportsChain[sportIndex]

            this.leagueOptions = this.selectedSport.leagues

            const leagueIndex = this.leagueOptions.map(x => x.name).indexOf(this.bet.league)

            this.selectedLeague = this.leagueOptions[leagueIndex]
            this.teamOptions = this.selectedLeague.teams
        },
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
                case 'Player Prop':
                    this.bet.details = {
                        player: null
                    }
                    break;
                default:
                    this.bet.details = {}
            }
        },
        get_winner_options() {
            if (!this.bet.league || !this.bet.teamA || !this.bet.teamB) {
                return []
            }
            return [
                { text: this.bet.teamA, value: "A" },
                { text: this.bet.teamB, value: "B" },
                { text: 'Draw', value: "C" },
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

            const betBody = { ...this.bet, details: JSON.stringify(this.bet.details) }

            if (this.betProp) {
                await this.$axios.put(`bet/update/${this.betProp.id}`, betBody)
                    .then((resp) => {
                        this.$emit('added')
                    });
            } else {
                await this.$axios.post(`bet/create`, betBody)
                    .then((resp) => {
                        this.$emit('added')
                    });
            }

            this.loading = false
        }
    }
}