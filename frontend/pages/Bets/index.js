import GeneralServices from "@/services/GeneralServices";
import ManageBetDialog from "~/components/dialogs/ManageBet/index.vue";
import { getBetPrediction } from "~/shared/functions/GetBetPrediction";
export default {
    name: 'Bets',
    components: { ManageBetDialog },
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
        sportsbooks: [],
        sportsChain: [],
        betToUpdate: null,
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

            for (let i = 0; i < this.sportsChain.length; i++) {
                options.push({ text: this.sportsChain[i].name, value: this.sportsChain[i].name })
            }

            return options
        },
        leagueFilterOptions() {
            const options = [
                { text: 'All', value: null }
            ]

            if (this.sportFilter) {
                const sportIndex = this.sportsChain.map(x => x.name).indexOf(this.sportFilter)
                for (let i = 0; i < this.sportsChain[sportIndex].leagues.length; i++) {
                    const league = this.sportsChain[sportIndex].leagues[i].name
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
                'Actions', 'Date', 'Matchup', 'Prediction', 'Value', 'Odds', 'Won', 'Profit'
            ]
        }
    },
    async created() {
        if (this.$route.query.page) {
            this.page = parseInt(this.$route.query.page);
        }
        this.betTypes = await this.generalServices.getBetTypeOptions(this.$axios)
        await this.getBets();
        await this.reloadAssets()
    },
    watch: {
        dialog(value) {
            if (!value) {
                this.betToUpdate = null
            }
        }
    },
    methods: {
        closeDialog() {
            this.dialog = false
        },
        async deleteClick(bet) {
            await this.$axios.delete(`bet/delete/${bet.id}`)
            await this.getBets();
        },
        editClick(bet) {
            this.betToUpdate = bet
            this.dialog = true
        },
        async reloadAssets() {
            this.sportsChain = await this.generalServices.getSportsChain(this.$axios);
            this.sportsbooks = await this.generalServices.getSportsbooks(this.$axios)
            await this.getLeagues();
        },
        getBetPrediction,
        getBetProfit(bet) {
            if (bet.won === null) {
                return '-'
            }

            let profit
            if (bet.won) {
                profit = bet.payout - bet.value
            } else if (bet.push) {
                profit = bet.payout
            } else {
                profit = -bet.value
            }

            return this.generalServices.formatValue(profit)
        },
        async betAdded() {
            this.dialog = false
            this.betToUpdate = null

            await this.getBets()
            await this.reloadAssets()
        },
        changePage() {
            this.$router.replace({
                query: { page: this.page }
            });
            this.getBets();
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