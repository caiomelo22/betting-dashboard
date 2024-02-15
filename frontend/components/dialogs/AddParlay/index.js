import NumberField from "~/components/textFields/NumberField/index.vue";
import ValidationService from "~/services/ValidationService";
import { NumberFieldEnum } from "~/shared/enums/NumberFieldEnum";
import { bothScorePredictionOptions } from "~/shared/enums/BothScorePredictionOptions";
export default {
    name: 'AddParlayDialog',
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
        parlay: {
            date: null,
            value: null,
            odds: null,
            bets: []
        },
        bothScorePredictionOptions,
        loading: false,
        winnerPrediction: null,
        editIndex: null,
        bet: null,
        teamOptions: [],
        numberFieldEnum: NumberFieldEnum
    }),
    props: {
        leagues: Array,
        betTypeOptions: Array
    },
    created() {
        this.parlay.date = this.$moment().format('YYYY-MM-DD')

        if (this.leagues.length === 1) {
            this.bet.leagueId = this.leagues[0].id
            this.league_changed(this.leagues[0])
        }
    },
    methods: {
        getBetPrediction (bet) {
            switch (bet.type) {
                case 'Moneyline':
                    return bet.prediction;
                case 'Total':
                    return `${bet.prediction} ${bet.line}`;
                case 'Both Score':
                    return bet.prediction ? 'Yes' : 'No';
                case 'Spread':
                    return `${bet.prediction} +${bet.spread}`;
            }
        },
        add_bet() {
            const result = this.$refs.betForm.validate()
            if (!result) {
                return
            }
            this.parlay.bets.push(this.bet)
            this.reset_new_bet()
        },
        reset_new_bet() {
            this.bet = null
            this.editIndex = null
            this.winnerPrediction = null
        },
        remove_bet_click(i) {
            this.parlay.bets.splice(i, 1)
        },
        edit_bet_click(bet, i) {
            this.editIndex = i
            this.bet = { ...bet }
        },
        edit_bet() {
            this.parlay.bets[this.editIndex] = this.bet
            this.reset_new_bet()
        },
        add_bet_click() {
            if (!this.bet) {
                this.bet = {
                    leagueId: null,
                    homeTeamId: null,
                    awayTeamId: null,
                    homeTeam: null,
                    awayTeam: null,
                    type: 'Moneyline',
                    prediction: null,
                    spread: null,
                    line: null
                }
            }
        },
        save_bet_click() {
            if (this.editIndex == null) {
                this.add_bet()
            } else {
                this.edit_bet()
            }
        },
        winner_prediction_changed() {
            switch (this.winnerPrediction) {
                case this.bet.homeTeamId:
                    this.bet.prediction = 'Home'
                    break;
                case this.bet.awayTeamId:
                    this.bet.prediction = 'Away'
                    break;
                case 0:
                    this.bet.prediction = 'Draw'
                    break;
            }
        },
        get_winner_options() {
            if (!this.bet.leagueId || !this.bet.homeTeamId || !this.bet.awayTeamId) {
                return []
            }
            const leagueSelected = this.leagues.find(x => x.id === this.bet.leagueId)
            return [
                leagueSelected.teams.find(x => x.teamId === this.bet.homeTeamId).team,
                leagueSelected.teams.find(x => x.teamId === this.bet.awayTeamId).team,
                { name: 'Draw', id: 0 }
            ]
        },
        league_changed(leagueId) {
            const league = this.leagues.find(x => x.id === leagueId)
            this.bet.homeTeamId = null;
            this.bet.awayTeamId = null;
            this.teamOptions = league.teams.map(x => x.team);
        },
        async submit() {
            const result = this.$refs.form.validate();
            if (!result || this.parlay.bets.length == 0) {
                return;
            }
            this.loading = true
            await this.$axios.post(`parlay/create`, this.parlay)
                .then((resp) => {
                    this.$emit('added')
                });
            this.loading = false
        }
    }
}