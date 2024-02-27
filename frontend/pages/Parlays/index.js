import GeneralServices from "@/services/GeneralServices";
import AddParlayDialog from "~/components/dialogs/AddParlay/index.vue";
import ParlayDetailsDialog from "~/components/dialogs/ParlayDetails/index.vue";
export default {
    name: 'Parlays',
    components: { AddParlayDialog, ParlayDetailsDialog },
    data: () => ({
        generalServices: new GeneralServices(),
        page: 1,
        totalPages: 1,
        loading: false,
        dialog: false,
        detailsDialog: false,
        selectedParlay: null,
        leagues: [],
        parlays: []
    }),
    computed: {
        parlays_headers() {
            return [
                'Date', 'League', 'Value', 'Odds', 'Details', 'Won', 'Profit'
            ]
        }
    },
    async created() {
        if (this.$route.query.page) {
            this.page = parseInt(this.$route.query.page);
        }
        await this.get_parlays();
        await this.get_leagues();
    },
    methods: {
        open_details_dialog(parlay) {
            this.selectedParlay = parlay
            this.detailsDialog = true
        },
        reset_details_dialog() {
            this.detailsDialog = false
            this.selectedParlay = null
        },
        get_league(parlay) {
            const set = [...new Set(parlay.bets.map(x => x.match.league.name))]
            return set.join('/')
        },
        get_parlay_profit(parlay) {
            if (!parlay.finished) {
                return '-'
            }

            let profit = 0
            if (parlay.won) {
                profit = parlay.value * parlay.odds - parlay.value
            } else {
                profit -= parlay.value
            }
            return this.generalServices.formatValue(profit)
        },
        async parlay_added() {
            this.dialog = false
            await this.get_parlays()
        },
        change_page() {
            this.$router.replace({
                query: { page: this.page }
            });
            this.get_parlays();
        },
        async get_leagues() {
            await this.$axios.get(`league/list`)
                .then((resp) => {
                    this.leagues = resp.data
                });
        },
        async get_parlays() {
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