import NumberField from "~/components/textFields/NumberField/index.vue";
import ValidationService from "~/services/ValidationService";
import { NumberFieldEnum } from "~/shared/enums/NumberFieldEnum";
export default {
  name: 'AddBetDialog',
  components: { NumberField },
  computed: {
    bet_type_options() {
      return [
        'Moneyline',
        'Total'
      ]
    },
    total_prediction_options() {
      return [
        'Over',
        'Under'
      ]
    }
  },
  data: () => ({
    validationService: new ValidationService(),
    bet: {
      leagueId: null,
      homeTeamId: null,
      awayTeamId: null,
      matchDate: null,
      value: null,
      odds: null,
      type: 'Moneyline',
      prediction: null,
      line: null
    },
    loading: false,
    winnerPrediction: null,
    teamOptions: [],
    numberFieldEnum: NumberFieldEnum
  }),
  props: {
    leagues: Array
  },
  created() {
    this.bet.matchDate = this.$moment().format('YYYY-MM-DD')

    if (this.leagues.length === 1) {
      this.bet.leagueId = this.leagues[0].id
      this.league_changed(this.leagues[0])
    }
  },
  methods: {
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
      if (!result) {
        return;
      }
      this.loading = true
      await this.$axios.post(`bet/create`, this.bet)
        .then((resp) => {
          this.$emit('added')
        })
        .catch((err) => {
          this.$toast.error(err.message)
        });
      this.loading = false
    }
  }
}