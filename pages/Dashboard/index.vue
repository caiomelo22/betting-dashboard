<template>
  <v-container>
    <v-row style="margin-bottom: 16px">
      <v-col cols="12" md="3">
        <div class="general-info">
          <p class="dashboard-info-title">Total Bets</p>
          <p class="dashboard-info-value">{{ generalInfo.totalReds + generalInfo.totalGreens }}</p>
        </div>
      </v-col>
      <v-col cols="12" md="3">
        <div class="general-info">
          <p class="dashboard-info-title">Total Reds</p>
          <p class="dashboard-info-value" style="color: red">{{ generalInfo.totalReds }}</p>
        </div>
      </v-col>
      <v-col cols="12" md="3">
        <div class="general-info">
          <p class="dashboard-info-title">Total Greens</p>
          <p class="dashboard-info-value" style="color: green">{{ generalInfo.totalGreens }}</p>
        </div>
      </v-col>
      <v-col cols="12" md="3">
        <div class="general-info">
          <p class="dashboard-info-title">Green %</p>
          <p class="dashboard-info-value">{{ (generalInfo.totalGreens * 100 / (generalInfo.totalReds + generalInfo.totalGreens)).toFixed(2) }}%</p>
        </div>
      </v-col>
    </v-row>
    <v-row style="margin-bottom: 16px">
      <v-col cols="12" md="6">
        <div class="general-info">
          <p class="dashboard-info-title">Total Bet</p>
          <p class="dashboard-info-value">{{ generalServices.format_value(generalInfo.totalBet) }}</p>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div class="general-info">
          <p class="dashboard-info-title">Profit</p>
          <p class="dashboard-info-value">{{ generalServices.format_value(generalInfo.totalProfit) }}</p>
        </div>
      </v-col>
    </v-row>
    <div>
      <canvas id="lineChart" width="400" height="400"></canvas>
    </div>
  </v-container>
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
</style>