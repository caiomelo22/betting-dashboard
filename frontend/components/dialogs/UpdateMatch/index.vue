<template>
  <v-card>
    <v-card-title>Update Match</v-card-title>
    <v-form ref="form" lazy-validation @submit.stop.prevent="submit">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <div>
              <p class="text-field-label">League</p>
              <p class="text-field-value">{{ match.league.name }}</p>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div>
              <p class="text-field-label">Match Date</p>
              <p class="text-field-value">{{
                generalServices.format_date(match.matchDate)
              }}</p>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <div>
              <p class="text-field-label">Home Team</p>
              <p class="text-field-value">{{ match.homeTeam.name }}</p>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div>
              <p class="text-field-label">Away Team</p>
              <p class="text-field-value">{{ match.awayTeam.name }}</p>
            </div>
          </v-col>
        </v-row>
        <div style="margin-top: 24px">
          <NumberField
            field-title="Home Team Score"
            :field-value="match.scoreHomeTeam"
            @update="(value) => (match.scoreHomeTeam = value)"
          />
        </div>
        <div>
          <NumberField
            field-title="Away Team Score"
            :field-value="match.scoreAwayTeam"
            @update="(value) => (match.scoreAwayTeam = value)"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="red" class="dialog-btn" outlined @click="$emit('close')">
          Cancel
        </v-btn>
        <v-btn color="green" class="dialog-btn" type="submit" :loading="loading" dark>
          Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<script src="./index"></script>
<style scoped>
p {
  margin-bottom: 0px !important;
}
</style>