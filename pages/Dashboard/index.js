import Chart from "chart.js/auto";
import GeneralServices from "@/services/GeneralServices";
import EditDepositedValueDialog from "@/components/dialogs/EditDepositedValue/index.vue";
export default {
  name: 'Dashboard',
  components: {
    EditDepositedValueDialog
  },
  data: () => ({
    generalServices: new GeneralServices(),
    editDepositedValueDialog: false,
    chartInfo: {
      labels: [],
      datasets: []
    },
    teamChartInfo: {
      labels: [],
      datasets: []
    },
    barChartInfo: {
      labels: [],
      datasets: []
    },
    outcomeChartInfo: {
      labels: [],
      datasets: []
    },
    generalInfo: {},
    leagueChartInfo: {},
    myChart: {}
  }),
  async mounted() {
    await this.get_dashboard_info()
    const ctx = document.getElementById("lineChart");
    this.myChart = new Chart(ctx, {
      type: "line",
      data: this.chartInfo,
      options: this.options
    });
    const ctxBar = document.getElementById("barChart");
    this.myChart = new Chart(ctxBar, {
      type: "bar",
      data: this.barChartInfo,
      options: this.options_no_legend
    });
    const ctxLeague = document.getElementById("leagueChart");
    this.myChart = new Chart(ctxLeague, {
      type: "line",
      data: this.leagueChartInfo,
      options: this.options
    });
    const ctxTeamBar = document.getElementById("teamChart");
    this.myChart = new Chart(ctxTeamBar, {
      type: "bar",
      data: this.teamChartInfo,
      options: this.options_no_legend
    });
    const ctxOutcomeBar = document.getElementById("outcomeChart");
    this.myChart = new Chart(ctxOutcomeBar, {
      type: "pie",
      data: this.outcomeChartInfo,
      options: this.pie_options
    });
  },
  computed: {
    options_no_legend() {
      return {
        elements: {
          line: {
            tension: 0
          }
        },
        plugins: {
          legend: {
            display: false,
          }
        },
        maintainAspectRatios: false,
        responsive: true,
        maintainAspectRatio: false
      }
    },
    options() {
      return {
        elements: {
          line: {
            tension: 0
          }
        },
        maintainAspectRatios: false,
        responsive: true,
        maintainAspectRatio: false
      }
    },
    pie_options() {
      return {
        maintainAspectRatios: false,
        responsive: true,
        maintainAspectRatio: false
      }
    },
  },
  methods: {
    update_deposited_value(value) {
      this.generalInfo.totalDeposited = value
      this.editDepositedValueDialog = false
    },
    async get_dashboard_info() {
      await this.$axios.get(`bet/dashboard`)
        .then((resp) => {
          this.chartInfo = resp.data.chartInfo
          this.generalInfo = resp.data.generalInfo
          this.barChartInfo = resp.data.barChartInfo
          this.leagueChartInfo = resp.data.leagueChartInfo
          this.teamChartInfo = resp.data.teamChartInfo
          this.outcomeChartInfo = resp.data.outcomeChartInfo
        })
        .catch((err) => {
          this.$toast.error(err.message)
        });
    }
  }
}