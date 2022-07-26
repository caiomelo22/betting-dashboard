<template>
  <v-container>
    <div v-if="loading" class="row">
      <v-progress-circular size="20" color="#41b883" indeterminate />
    </div>
    <div v-else>
      <div class="row">
        <v-btn color="#41b883" dark @click="dialog = true">
          <font-awesome-icon
            :icon="['fa', 'plus']"
            style="color: white; margin-right: 8px"
          />
          Add Bet
        </v-btn>
      </div>
      <table class="data-table">
        <thead>
          <th v-for="(header, i) in bets_headers" :key="i">{{ header }}</th>
        </thead>
        <tbody>
          <tr v-for="(bet, i) in bets" :key="i">
            <td>
              {{ generalServices.format_date(bet.match.matchDate) }}
            </td>
            <td>
              {{
                bet.match.league.name
              }}
            </td>
            <td>
              {{ `${bet.match.homeTeam.name} x ${bet.match.awayTeam.name}` }}
            </td>
            <td>
              {{ bet.type }}
            </td>
            <td>
              {{ get_bet_prediction(bet) }}
            </td>
            <td>
              {{ generalServices.format_value(bet.value) }}
            </td>
            <td>
              {{ bet.odds }}
            </td>
            <td>
              <font-awesome-icon
                v-if="bet.match.scoreHomeTeam == null"
                :icon="['fa', 'arrows-rotate']"
                style="color: blue"
              />
              <font-awesome-icon
                v-else-if="bet.won"
                :icon="['fa', 'check']"
                style="color: green"
              />
              <font-awesome-icon
                v-else
                :icon="['fa', 'xmark']"
                style="color: red"
              />
            </td>
            <td>
              {{ get_bet_profit(bet) }}
            </td>
          </tr>
        </tbody>
      </table>
      <v-pagination
        v-model="page"
        color="#41b883"
        :length="totalPages"
        style="margin-top: 16px"
        @input="change_page"
      >
      </v-pagination>
    </div>
    <v-dialog v-if="dialog" v-model="dialog" max-width="100%" width="700px">
      <AddBetDialog
        :leagues="leagues"
        @close="dialog = false"
        @added="bet_added"
      />
    </v-dialog>
  </v-container>
</template>

<script src="./index"></script>

<style scoped>
.data-table {
  margin-top: 16px;
}
.row {
  padding: 12px;
  justify-content: center;
}
</style>