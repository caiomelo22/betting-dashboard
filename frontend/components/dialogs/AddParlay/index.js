import NumberField from "~/components/textFields/NumberField/index.vue";
import ValidationService from "~/services/ValidationService";
import { NumberFieldEnum } from "~/shared/enums/NumberFieldEnum";
import { bothScorePredictionOptions } from "~/shared/enums/BothScorePredictionOptions";
import { getBetPrediction } from "~/shared/functions/GetBetPrediction";
export default {
    name: 'AddParlayDialog',
    components: { NumberField },
    computed: {
        totalPredictionOptions() {
            return [
                'Over',
                'Under'
            ]
        },
        wonOptions() {
            return [
                { text: "Pending", value: null },
                { text: "Yes", value: true },
                { text: "No", value: false },
            ]
        }
    },
    data: () => ({
        validationService: new ValidationService(),
        parlay: {
            date: null,
            sportsbook: null,
            value: null,
            odds: null,
            won: null,
            push: false,
            payout: null,
            bets: []
        },
        bothScorePredictionOptions,
        loading: false,
        winnerPrediction: null,
        editIndex: null,
        bet: null,
        leagueOptions: [],
        teamOptions: [],
        numberFieldEnum: NumberFieldEnum
    }),
    props: {
        parlayProp: Object,
        sportsChain: Array,
        sportsbookOptions: Array,
        betTypeOptions: Array
    },
    created() {
        if (this.parlayProp) {
            this.parlay = {
                ...this.parlayProp,
                changed: true
            }

            const bets = [...this.parlay.bets]

            for (let i = 0; i < bets.length; i++) {
                bets[i] = {
                    ...bets[i],
                    type: bets[i].details.type,
                    prediction: bets[i].details.details.prediction,
                    earlyPayout: bets[i].details.earlyPayout,
                    details: bets[i].details.details
                }

                bets[i].date = bets[i].date.split('T')[0]
            }

            this.parlay.bets = bets

            this.parlay.date = this.parlay.date.split('T')[0]
        } else {
            this.parlay.date = this.$moment().format('YYYY-MM-DD')
        }
    },
    methods: {
        getBetPrediction,
        parlayOddsChanged(value) {
            this.parlay.odds = value

            this.updateParlayPayout()
        },
        parlayValueChanged(value) {
            this.parlay.value = value

            this.updateParlayPayout()
        },
        updateParlayPayout() {
            if (this.parlay.won) {
                this.parlay.payout = parseFloat((this.parlay.odds * this.parlay.value).toFixed(2))
            } else {
                this.parlay.payout = 0
            }
        },
        betTypeChanged() {
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
        addBet() {
            const result = this.$refs.betForm.validate()
            if (!result) {
                return
            }
            this.parlay.bets.push(this.bet)
            this.resetNewBet()
        },
        resetNewBet() {
            this.bet = null
            this.editIndex = null
            this.winnerPrediction = null
        },
        removeBetClick(i) {
            this.parlay.bets.splice(i, 1)
        },
        editBetClick(bet, i) {
            this.editIndex = i
            this.bet = { ...bet }

            const sportIndex = this.sportsChain.map(x => x.name).indexOf(this.bet.sport)
            const selectedSport = this.sportsChain[sportIndex]

            this.leagueOptions = selectedSport.leagues

            const leagueIndex = this.leagueOptions.map(x => x.name).indexOf(this.bet.league)

            this.selectedLeague = this.leagueOptions[leagueIndex]
            this.teamOptions = this.selectedLeague.teams
        },
        editBet() {
            this.parlay.bets[this.editIndex] = this.bet
            this.resetNewBet()
        },
        addBetClick(lastBet) {
            this.bet = {
                sport: lastBet?.sport,
                league: lastBet?.league,
                teamA: lastBet?.teamA,
                teamB: lastBet?.teamB,
                date: this.parlay.date,
                type: 'Moneyline',
                push: false,
                prediction: null,
                won: null,
                payout: 0,
                details: {}
            }
        },
        saveBetClick() {
            if (this.editIndex == null) {
                this.addBet()
            } else {
                this.editBet()
            }
        },
        getWinnerOptions() {
            if (!this.bet.league || !this.bet.teamA || !this.bet.teamB) {
                return []
            }
            return [
                { text: this.bet.teamA, value: "A" },
                { text: this.bet.teamB, value: "B" },
                { text: 'Draw', value: "C" },
            ]
        },
        sportChanged() {
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

            this.leagueChanged()
        },
        leagueChanged() {
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
            if (!result || this.parlay.bets.length == 0) {
                return;
            }

            this.loading = true

            const bets = this.parlay.bets

            for (let i = 0; i < bets.length; i++) {
                bets[i] = { ...bets[i], details: JSON.stringify(bets[i].details) }
            }

            if (this.parlayProp) {
                await this.$axios.put(`parlay/update/${this.parlayProp.id}`, { ...this.parlay, bets })
                    .then((resp) => {
                        this.$emit('added')
                    });
            } else {
                await this.$axios.post(`parlay/create`, { ...this.parlay, bets })
                    .then((resp) => {
                        this.$emit('added')
                    });
            }
            this.loading = false
        }
    }
}