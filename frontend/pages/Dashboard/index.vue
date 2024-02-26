<template>
    <div class="mx-12">
        <v-row style="margin-bottom: 16px">
            <v-col cols="12" md="4">
                <div class="general-info">
                    <p class="dashboard-info-title">Red/Green Ratio</p>
                    <p class="dashboard-info-value" :style="`color: ${$vuetify.theme.dark ? 'white' : 'black'}`"><span
                            style="color: #990000"
>{{ generalInfo.totalReds
                            }}</span>:<span style="color: green">{{ generalInfo.totalGreens }}</span></p>
                </div>
            </v-col>
            <v-col cols="12" md="2">
                <div class="general-info">
                    <p class="dashboard-info-title">Average Odds</p>
                    <p class="dashboard-info-value">{{ (generalInfo.avgOdds || 0).toFixed(2) }}</p>
                </div>
            </v-col>
            <v-col cols="12" md="2">
                <div class="general-info">
                    <p class="dashboard-info-title">Green %</p>
                    <p class="dashboard-info-value">{{ (generalInfo.totalGreens * 100 / (generalInfo.totalReds +
                        generalInfo.totalGreens)).toFixed(2)
                    }}%</p>
                </div>
            </v-col>
            <v-col cols="12" md="2">
                <div class="general-info">
                    <p class="dashboard-info-title">ROI</p>
                    <p class="dashboard-info-value">{{ (generalInfo.totalProfit * 100 / (generalInfo.totalDeposited)).toFixed(2) }}%
                    </p>
                </div>
            </v-col>
            <v-col cols="12" md="2">
                <div class="general-info">
                    <p class="dashboard-info-title">Yield</p>
                    <p class="dashboard-info-value">{{ (generalInfo.totalProfit * 100 / (generalInfo.totalBet)).toFixed(2)
                    }}%
                    </p>
                </div>
            </v-col>
        </v-row>
        <v-row style="margin-bottom: 16px">
            <v-col cols="12" md="4">
                <div class="general-info">
                    <v-row align="center" no-gutters>
                        <div>
                            <p class="dashboard-info-title">Deposited Value</p>
                            <p class="dashboard-info-value">{{ generalServices.formatValue(generalInfo.totalDeposited)
                            }}</p>
                        </div>
                        <v-spacer />
                        <v-icon color="secondary" @click="editDepositedValueDialog = true">mdi-pencil</v-icon>
                    </v-row>
                </div>
            </v-col>
            <v-col cols="12" md="4">
                <div class="general-info">
                    <p class="dashboard-info-title">Total Bet</p>
                    <p class="dashboard-info-value">{{ generalServices.formatValue(generalInfo.totalBet) }}</p>
                </div>
            </v-col>
            <v-col cols="12" md="4">
                <div class="general-info">
                    <p class="dashboard-info-title">Net Gains</p>
                    <p class="dashboard-info-value">{{ generalServices.formatValue(generalInfo.totalProfit) }}</p>
                </div>
            </v-col>
        </v-row>
        <div class="section-div chart-div">
            <v-row no-gutters align="center" justify="center">
                <p class="chart-header">Bet Progression</p>
                <v-btn class="btn-primary ml-4" @click="reset_zoom(progressionChart)">Reset Zoom</v-btn>
            </v-row>
            <div>
                <canvas id="progressionChart" width="400" height="400"></canvas>
            </div>
        </div>
        <div class="section-div">
            <v-row>
                <v-col cols="12" md="6" lg="4">
                    <div class="chart-div">
                        <p class="chart-header">Profit by Outcome</p>
                        <div>
                            <canvas id="outcomeChart" width="400" height="400"></canvas>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" md="6" lg="8">
                    <div class="chart-div">
                        <v-row no-gutters align="center" justify="center">
                            <p class="chart-header">Profit by League</p>
                            <v-btn class="btn-primary ml-4" @click="reset_zoom(leagueChart)">Reset Zoom</v-btn>
                        </v-row>
                        <div>
                            <canvas id="leagueChart" width="400" height="400"></canvas>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="section-div chart-div">
            <v-row no-gutters align="center" justify="center">
                <p class="chart-header">Profit by Team</p>
                <v-btn class="btn-primary ml-4" @click="reset_zoom(teamChart)">Reset Zoom</v-btn>
            </v-row>
            <div>
                <canvas id="teamChart" width="400" height="400"></canvas>
            </div>
        </div>
        <v-dialog v-if="editDepositedValueDialog" v-model="editDepositedValueDialog" width="700px" max-width="100%">
            <AddFinancialActionDialog
:deposited-value-prop="generalInfo.totalDeposited" @update="updateDepositedValue"
                @close="editDepositedValueDialog = false"
/>
        </v-dialog>
    </div>
</template>

<script src="./index">
</script>

<style scoped>
p {
    margin-bottom: 0px;
}

.dashboard-info-title,
.dashboard-info-value {
    font-weight: 700;
}

.dashboard-info-title {
    font-size: 20px;
    line-height: 0.7;
}

.dashboard-info-value {
    font-size: 30px;
    color: #41b883;
}

.general-info {
    border: 1px solid;
    padding: 16px;
    box-shadow: 5px 10px #41b883;
}

.chart-div {
    border: 1px solid;
    padding: 16px;
    border-radius: 15px;
}
</style>