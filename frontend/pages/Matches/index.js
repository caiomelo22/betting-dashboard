import ApiService from "@/services/ApiService";
import GeneralServices from "@/services/GeneralServices";
import UpdateMatchDialog from "~/components/dialogs/UpdateMatch/index.vue";
export default {
  name: 'Matches',
  components: { UpdateMatchDialog },
  data: () => ({
    generalServices: new GeneralServices(),
    api: new ApiService(),
    page: 1,
    totalPages: 1,
    loading: false,
    dialog: false,
    matchSelected: null,
    matches: []
  }),
  computed: {
    matches_headers() {
      return [
        'Matchup', 'Date', 'Action'
      ]
    }
  },
  async created() {
    if (this.$route.query.page) {
      this.page = parseInt(this.$route.query.page);
    }
    await this.get_matches();
  },
  methods: {
    match_click(match) {
      this.matchSelected = match
      this.dialog = true
    },
    async match_updated() {
      this.dialog = false
      await this.get_matches()
    },
    change_page() {
      this.$router.replace({
        query: { page: this.page }
      });
      this.get_matches();
    },
    async get_matches() {
      this.loading = true
      const params = this.generalServices.serialize({ page: this.page });
      await this.$axios.get(`match/list?${params}`)
        .then((resp) => {
          this.matches = resp.data.matches
          this.totalPages = resp.data.totalPages
        })
        .catch((err) => {
          this.$toast.error(err.message)
        });
      this.loading = false
    }
  }
}