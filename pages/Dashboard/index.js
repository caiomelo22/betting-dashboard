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
        betLineChart: null,
        betBarChart: null,
        leagueChart: null,
        outcomeChart: null,
        teamChart: null,
    }),
    async mounted() {
        await this.get_dashboard_info()
        this.reload_charts()
    },
    watch: {
        '$vuetify.theme.dark'() {
            this.reload_charts()
        }
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
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: this.$vuetify.theme.dark ? 'white' : 'black'
                        },
                        grid: {
                            color: this.$vuetify.theme.dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
                        }
                    },
                    x: {
                        ticks: {
                            color: this.$vuetify.theme.dark ? 'white' : 'black'
                        },
                        grid: {
                            color: this.$vuetify.theme.dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
                        }
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
                plugins: {
                    legend: {
                        labels: {
                            color: this.$vuetify.theme.dark ? 'white' : 'black'
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: this.$vuetify.theme.dark ? 'white' : 'black'
                        },
                        grid: {
                            color: this.$vuetify.theme.dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
                        }
                    },
                    x: {
                        ticks: {
                            color: this.$vuetify.theme.dark ? 'white' : 'black'
                        },
                        grid: {
                            color: this.$vuetify.theme.dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
                        }
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
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: this.$vuetify.theme.dark ? 'white' : 'black'
                        }
                    }
                },
            }
        },
    },
    methods: {
        destroy_charts() {
            if (this.betLineChart) {
                this.betLineChart.destroy()
            }
            if (this.betBarChart) {
                this.betBarChart.destroy()
            }
            if (this.leagueChart) {
                this.leagueChart.destroy()
            }
            if (this.teamChart) {
                this.teamChart.destroy()
            }
            if (this.outcomeChart) {
                this.outcomeChart.destroy()
            }
        },
        reload_charts() {
            this.destroy_charts()
            const ctx = document.getElementById("lineChart");
            this.betLineChart = new Chart(ctx, {
                type: "line",
                data: this.chartInfo,
                options: this.options
            });
            const ctxBar = document.getElementById("barChart");
            this.betBarChart = new Chart(ctxBar, {
                type: "bar",
                data: this.barChartInfo,
                options: this.options_no_legend
            });
            const ctxLeague = document.getElementById("leagueChart");
            this.leagueChart = new Chart(ctxLeague, {
                type: "line",
                data: this.leagueChartInfo,
                options: this.options
            });
            const ctxTeamBar = document.getElementById("teamChart");
            this.teamChart = new Chart(ctxTeamBar, {
                type: "bar",
                data: this.teamChartInfo,
                options: this.options_no_legend
            });
            const ctxOutcomeBar = document.getElementById("outcomeChart");
            this.outcomeChart = new Chart(ctxOutcomeBar, {
                type: "pie",
                data: this.outcomeChartInfo,
                options: this.pie_options
            });
        },
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