import GeneralServices from "@/services/GeneralServices";
import AddBetDialog from "~/components/dialogs/AddBet/index.vue";
import { getBetPrediction } from "~/shared/functions/GetBetPrediction";
export default {
    name: 'Bets',
    components: { AddBetDialog },
    data: () => ({
        generalServices: new GeneralServices(),
        page: 1,
        totalPages: 1,
        loading: false,
        dialog: false,
        sportFilter: null,
        leagueFilter: null,
        betTypeFilter: null,
        betTypes: [],
        leagues: [],
        sportsChain: {},
        bets: []
    }),
    computed: {
        betTypeOptions() {
            const options = [
                { text: 'All', value: null }
            ]

            for (let i = 0; i < this.betTypes.length; i++) {
                options.push({ text: this.betTypes[i].name, value: this.betTypes[i].name })
            }

            return options
        },
        sportFilterOptions() {
            const options = [
                { text: 'All', value: null }
            ]

            for (const sport in this.sportsChain) {
                options.push({ text: sport, value: sport })
            }

            return options
        },
        leagueFilterOptions() {
            const options = [
                { text: 'All', value: null }
            ]

            if (this.sportFilter) {
                for (const league in this.sportsChain[this.sportFilter].leagues) {
                    options.push({ text: league, value: league })
                }
            } else {
                for (let i = 0; i < this.leagues.length; i++) {
                    options.push({ text: this.leagues[i], value: this.leagues[i] })
                }
            }

            return options
        },
        betHeaders() {
            return [
                'Date', 'League', 'Matchup', 'Bet Type', 'Prediction', 'Value', 'Odds', 'Won', 'Profit'
            ]
        }
    },
    async created() {
        if (this.$route.query.page) {
            this.page = parseInt(this.$route.query.page);
        }
        await this.getBetTypeOptions()
        await this.getBets();
        await this.getSportsChain();
        await this.getLeagues();
    },
    methods: {
        async getBetTypeOptions() {
            await this.$axios.get(`bet-type/list`)
                .then((resp) => {
                    this.betTypes = resp.data
                });
        },
        getBetPrediction,
        getBetProfit(bet) {
            if (bet.won === null) {
                return '-'
            }

            let profit = 0
            if (bet.won || bet.details.earlyPayout) {
                profit = bet.value * bet.odds - bet.value
            } else if (bet.push) {
                profit = 0
            } else {
                profit -= bet.value
            }
            return this.generalServices.formatValue(profit)
        },
        async betAdded() {
            this.dialog = false
            await this.getBets()
        },
        changePage() {
            this.$router.replace({
                query: { page: this.page }
            });
            this.getBets();
        },
        async getSportsChain() {
            await this.$axios.get(`bet/sports-chain`)
                .then((resp) => {
                    this.sportsChain = resp.data
                });
        },
        async getLeagues() {
            await this.$axios.get(`bet/leagues/list`)
                .then((resp) => {
                    this.leagues = resp.data
                });
        },
        async getBets() {
            this.loading = true
            const params = this.generalServices.serialize({
                page: this.page,
                sport: this.sportFilter,
                league: this.leagueFilter,
                betType: this.betTypeFilter
            });
            await this.$axios.get(`bet/list?${params}`)
                .then((resp) => {
                    this.bets = resp.data.bets
                    this.totalPages = resp.data.totalPages
                });
            this.loading = false
        }
    }
}