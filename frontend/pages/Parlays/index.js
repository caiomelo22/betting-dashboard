import GeneralServices from "@/services/GeneralServices";
import AddParlayDialog from "~/components/dialogs/AddParlay/index.vue";
import { getBetPrediction } from "~/shared/functions/GetBetPrediction";
export default {
    name: 'Parlays',
    components: { AddParlayDialog },
    data: () => ({
        generalServices: new GeneralServices(),
        page: 1,
        totalPages: 1,
        loading: false,
        dialog: false,
        selectedParlay: null,
        leagues: [],
        showParlayDetails: null,
        parlays: []
    }),
    computed: {
        parlays_headers() {
            return [
                'Actions', 'Date', 'Description', 'Value', 'Odds', 'Won', 'Profit'
            ]
        }
    },
    async created() {
        if (this.$route.query.page) {
            this.page = parseInt(this.$route.query.page);
        }
        await this.getParlays();
    },
    methods: {
        getBetPrediction,
        getParlayDescription(parlay) {
            const teamsA = [...new Set(parlay.bets.map(x => x.teamA))]
            const teamsB = [...new Set(parlay.bets.map(x => x.teamB))]

            if (teamsA.length == 1 && teamsB.length == 1) {
                return `${teamsA[0]} x ${teamsB[0]} Parlay`
            }

            const leagues = [...new Set(parlay.bets.map(x => x.league))]

            if (leagues.length == 1) {
                return `${leagues[0]} Parlay`
            }

            const sports = [...new Set(parlay.bets.map(x => x.sport))]

            if (sports.length == 1) {
                return `${sports[0]} Parlay`
            }

            return "Multisport Parlay"
        },
        async deleteClick(parlay) {
            await this.$axios.delete(`parlay/delete/${parlay.id}`)
            await this.getParlays();
        },
        editClick(bet) {
            // this.betToUpdate = bet
            // this.dialog = true
        },
        detailsClick(parlay) {
            if (this.showParlayDetails != parlay) {
                this.showParlayDetails = parlay
            } else {
                this.showParlayDetails = null
            }
        },
        getParlayProfit(parlay) {
            if (parlay.won === null) {
                return '-'
            }

            let profit
            if (parlay.won) {
                profit = parlay.payout - parlay.value
            } else if (parlay.push) {
                profit = parlay.payout
            } else {
                profit = -parlay.value
            }

            return this.generalServices.formatValue(profit)
        },
        async parlayAdded() {
            this.dialog = false
            await this.getParlays()
        },
        changePage() {
            this.$router.replace({
                query: { page: this.page }
            });
            this.getParlays();
        },
        async getParlays() {
            this.loading = true
            const params = this.generalServices.serialize({ page: this.page });
            await this.$axios.get(`parlay/list?${params}`)
                .then((resp) => {
                    this.parlays = resp.data.parlays
                    this.totalPages = resp.data.totalPages
                });
            this.loading = false
        }
    }
}