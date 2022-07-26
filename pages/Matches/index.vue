<template>
  <v-container>
    <div v-if="loading" class="row">
      <v-progress-circular size="20" color="#41b883" indeterminate />
    </div>
    <div v-else-if="matches.length > 0">
      <table class="data-table">
        <thead>
          <th v-for="(header, i) in matches_headers" :key="i">{{ header }}</th>
        </thead>
        <tbody>
          <tr v-for="(match, i) in matches" :key="i">
            <td>
              {{ `${match.homeTeam.name} x ${match.awayTeam.name}` }}
            </td>
            <td>
              {{ generalServices.format_date(match.matchDate) }}
            </td>
            <td>
              <v-btn fab color="#41b883" small @click="match_click(match)">
                <font-awesome-icon
                  :icon="['fa', 'pencil']"
                  style="color: white"
                />
              </v-btn>
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
    <v-row v-else>
      <h4>There are no matches left to update the score.</h4>
    </v-row>
    <v-dialog v-if="dialog" v-model="dialog" max-width="100%" width="700px">
      <UpdateMatchDialog
        :match-prop="matchSelected"
        @close="dialog = false"
        @updated="match_updated"
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