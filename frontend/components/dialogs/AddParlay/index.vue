<template>
    <v-card>
        <v-card-title>Manage Bet</v-card-title>
        <v-form ref="form" lazy-validation @submit.stop.prevent="submit">
            <v-card-text>
                <div>
                    <span class="text-field-label">Date</span>
                    <v-text-field
v-model="parlay.date" outlined dense hint="YYYY-MM-DD" :rules="[
                      validationService.required(parlay.date),
                      validationService.validDate(parlay.date),
                    ]" class="text-field"
/>
                </div>
                <div>
                    <NumberField
field-title="Value" :field-value="parlay.value" :type="numberFieldEnum.Currency"
                        @update="(value) => (parlay.value = value)"
/>
                </div>
                <div>
                    <NumberField
field-title="Odds" :field-value="parlay.odds" :type="numberFieldEnum.Odds"
                        @update="(value) => (parlay.odds = value)"
/>
                </div>

                <div class="table-wrapper">
                    <table class="data-table mt-0">
                        <thead>
                            <th>Matchup</th>
                            <th>Prediction</th>
                            <th>Actions</th>
                        </thead>
                        <tbody>
                            <tr v-for="(b, i) in parlay.bets" :key="i">
                                <td>
                                    {{ `${b.homeTeam.name} x ${b.awayTeam.name}` }}
                                </td>
                                <td>
                                    {{ getBetPrediction(b) }}
                                </td>
                                <td>
                                    <v-icon color="#41b883" @click="edit_bet_click(b, i)">mdi-pencil</v-icon>
                                    <v-icon color="red" class="ml-2" @click="remove_bet_click(i)">mdi-trash-can</v-icon>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <v-form ref="betForm" lazy-validation @submit.stop.prevent="save_bet_click">
                    <v-row v-if="bet" align="center" class="mt-6">
                        <v-col cols="12" md="6">
                            <span class="text-field-label">League</span>
                            <v-select
v-model="bet.leagueId" :items="leagues" item-text="name" item-value="id" outlined
                                dense :rules="[validationService.required(bet.leagueId)]" class="text-field"
                                @change="league_changed"
/>
                        </v-col>
                        <v-col cols="12" md="6">
                            <NumberField
field-title="Odds" :field-value="bet.odds" :type="numberFieldEnum.Odds"
                                @update="(value) => (bet.odds = value)"
/>
                        </v-col>
                        <v-col cols="12" md="6">
                            <span class="text-field-label">Home Team</span>
                            <v-select
v-model="bet.homeTeam" :disabled="!bet.leagueId"
                                :items="teamOptions.filter((x) => x.id != bet.awayTeamId)" item-text="name"
                                return-object outlined dense :rules="[validationService.required(bet.homeTeamId)]"
                                class="text-field" @change="bet.homeTeamId = bet.homeTeam.id"
/>
                        </v-col>
                        <v-col cols="12" md="6">
                            <span class="text-field-label">Away Team</span>
                            <v-select
v-model="bet.awayTeam" :disabled="!bet.leagueId"
                                :items="teamOptions.filter((x) => x.id != bet.homeTeamId)" item-text="name"
                                return-object outlined dense :rules="[validationService.required(bet.awayTeamId)]"
                                class="text-field" @change="bet.awayTeamId = bet.awayTeam.id"
/>
                        </v-col>
                        <v-col cols="12" md="6">
                            <span class="text-field-label">Bet Type</span>
                            <v-select
v-model="bet.type" :items="betTypeOptions" outlined dense
                                :rules="[validationService.required(bet.type)]" class="text-field"
/>
                        </v-col>
                        <v-col v-if="bet.type != 'Total'" cols="12" md="6">
                            <span class="text-field-label">Prediction</span>
                            <v-select
v-if="bet.type == 'Moneyline' || bet.type == 'Spread'" v-model="winnerPrediction"
                                :items="get_winner_options()" item-text="name" item-value="id" outlined dense
                                :rules="[validationService.required(winnerPrediction)]" class="text-field"
                                @change="winner_prediction_changed"
/>
                            <v-select
v-else-if="bet.type == 'BothScore'" v-model="bet.prediction"
                                :items="bothScorePredictionOptions" outlined dense
                                :rules="[validationService.required(bet.prediction)]" class="text-field"
/>
                            <NumberField
v-if="bet.type == 'Spread'" field-title="Spread" :type="numberFieldEnum.Line" :field-value="bet.spread"
                                @update="(value) => (bet.spread = value)"
/>
                        </v-col>
                        <v-col v-else-if="bet.type == 'Total'" cols="12" md="6">
                            <div>
                                <NumberField
field-title="Line" :field-value="bet.line" :type="numberFieldEnum.Line"
                                    @update="(value) => (bet.line = value)"
/>
                            </div>
                            <div>
                                <span class="text-field-label">Prediction</span>
                                <v-select
v-model="bet.prediction" :items="total_prediction_options" outlined dense
                                    :rules="[validationService.required(bet.prediction)]" class="text-field"
/>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row no-gutters align="center" justify="center" class="mt-3">
                        <v-btn v-if="bet" color="#41b883" dark type="submit">
                            <font-awesome-icon :icon="['fa', 'floppy-disk']" style="color: white; margin-right: 8px" />
                            Save Bet
                        </v-btn>
                        <v-btn v-else color="#41b883" dark @click="add_bet_click">
                            <font-awesome-icon :icon="['fa', 'plus']" style="color: white; margin-right: 8px" />
                            Add Bet
                        </v-btn>
                        <v-btn v-if="bet" color="red" class="ml-2" dark @click="reset_new_bet">
                            <font-awesome-icon :icon="['fa', 'close']" style="color: white; margin-right: 8px" />
                            Cancel
                        </v-btn>
                    </v-row>
                </v-form>
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