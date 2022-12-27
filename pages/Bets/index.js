import ApiService from "@/services/ApiService";
import GeneralServices from "@/services/GeneralServices";
import AddBetDialog from "~/components/dialogs/AddBet/index.vue";
import { betTypeOptions } from "~/shared/enums/BetTypeOptions";
import { get_bet_prediction } from "~/shared/functions/GetBetPrediction";
export default {
    name: 'Bets',
    components: { AddBetDialog },
    data: () => ({
        generalServices: new GeneralServices(),
        api: new ApiService(),
        page: 1,
        totalPages: 1,
        loading: false,
        dialog: false,
        league_filter: null,
        bet_type_filter: null,
        betTypeOptions,
        leagues: [],
        bets: []
    }),
    computed: {
        bet_type_filter_options() {
            const options = [
                { text: 'All', value: null }
            ]

            for (let i = 0; i < this.betTypeOptions.length; i++) {
                options.push({ text: this.betTypeOptions[i], value: this.betTypeOptions[i] })
            }

            return options
        },
        league_filter_options() {
            const options = [
                { text: 'All', value: null }
            ]

            for (let i = 0; i < this.leagues.length; i++) {
                options.push({ text: this.leagues[i].name, value: this.leagues[i].id })
            }

            return options
        },
        bets_headers() {
            return [
                'Date', 'League', 'Matchup', 'Bet Type', 'Prediction', 'Value', 'Odds', 'Won', 'Profit'
            ]
        }
    },
    async created() {
        if (this.$route.query.page) {
            this.page = parseInt(this.$route.query.page);
        }
        await this.get_bets();
        await this.get_leagues();
    },
    methods: {
        get_bet_prediction,
        get_bet_profit(bet) {
            if (bet.match.scoreHomeTeam === null || bet.match.awayHomeTeam) {
                return '-'
            }

            let profit = 0
            if (bet.won || bet.earlyPayout) {
                profit = bet.value * bet.odds - bet.value
            } else {
                profit -= bet.value
            }
            return this.generalServices.format_value(profit)
        },
        async bet_added() {
            this.dialog = false
            await this.get_bets()
        },
        change_page() {
            this.$router.replace({
                query: { page: this.page }
            });
            this.get_bets();
        },
        async get_leagues() {
            await this.$axios.get(`league/list`)
                .then((resp) => {
                    this.leagues = resp.data
                })
                .catch((err) => {
                    this.$toast.error(err.message)
                });
        },
        async get_bets() {
            this.loading = true
            const params = this.generalServices.serialize({ page: this.page, league_id: this.league_filter, bet_type: this.bet_type_filter });
            await this.$axios.get(`bet/list?${params}`)
                .then((resp) => {
                    this.bets = resp.data.bets
                    this.totalPages = resp.data.totalPages
                })
                .catch((err) => {
                    this.$toast.error(err.message)
                });
            this.loading = false
        }
    }
}