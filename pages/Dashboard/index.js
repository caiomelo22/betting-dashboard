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
    generalInfo: {},
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
  },
  computed: {
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
    }
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
        })
        .catch((err) => {
          this.$toast.error(err.message)
        });
    }
  }
}