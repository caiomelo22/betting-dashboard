import Chart from "chart.js/auto";
import GeneralServices from "@/services/GeneralServices";
import AddFinancialActionDialog from "@/components/dialogs/AddFinancialAction/index.vue";
export default {
    name: 'Dashboard',
    components: {
        AddFinancialActionDialog
    },
    data: () => ({
        generalServices: new GeneralServices(),
        editDepositedValueDialog: false,
        teamChartInfo: {
            labels: [],
            datasets: []
        },
        chartInfo: {
            labels: [],
            datasets: []
        },
        outcomeChartInfo: {
            labels: [],
            datasets: []
        },
        generalInfo: {},
        leagueChartInfo: {},
        progressionChart: null,
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
                    },
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x',
                            modifierKey: 'ctrl',
                        },
                        zoom: {
                            drag: {
                                enabled: true
                            },
                            mode: 'x',
                        },
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
                    },
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x',
                            modifierKey: 'ctrl',
                        },
                        zoom: {
                            drag: {
                                enabled: true
                            },
                            mode: 'x',
                        },
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
        reset_zoom(chart) {
            chart.resetZoom();
        },
        destroy_charts() {
            if (this.progressionChart) {
                this.progressionChart.destroy()
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
            const ctx = document.getElementById("progressionChart");
            this.progressionChart = new Chart(ctx, {
                type: "bar",
                data: this.chartInfo,
                options: this.options
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
        updateDepositedValue(value) {
            this.generalInfo.totalDeposited += value
            this.editDepositedValueDialog = false
        },
        async get_dashboard_info() {
            await this.$axios.get(`bet/dashboard`)
                .then((resp) => {
                    this.chartInfo = resp.data.chartInfo
                    this.generalInfo = resp.data.generalInfo
                    this.leagueChartInfo = resp.data.leagueChartInfo
                    this.teamChartInfo = resp.data.teamChartInfo
                    this.outcomeChartInfo = resp.data.outcomeChartInfo
                });
        }
    }
}