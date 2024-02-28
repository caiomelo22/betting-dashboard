<template>
    <v-card>
        <v-card-title>Manage Bet</v-card-title>
        <v-form ref="form" lazy-validation @submit.stop.prevent="submit">
            <v-card-text>
                <div>
                    <span class="text-field-label">Date</span>
                    <v-text-field v-model="parlay.date" outlined dense hint="YYYY-MM-DD" :rules="[
                        validationService.required(parlay.date),
                        validationService.validDate(parlay.date),
                    ]" class="text-field" />
                </div>
                <div>
                    <span class="text-field-label">Sportsbook</span>
                    <v-combobox v-model="parlay.sportsbook" :items="sportsbookOptions" outlined dense
                        :rules="[validationService.required(parlay.sportsbook)]" class="text-field" />
                </div>
                <div>
                    <NumberField field-title="Value" :field-value="parlay.value" :type="numberFieldEnum.Currency"
                        @update="parlayValueChanged" />
                </div>
                <div>
                    <NumberField field-title="Odds" :field-value="parlay.odds" :type="numberFieldEnum.Odds"
                        @update="parlayOddsChanged" />
                </div>
                <div>
                    <span class="text-field-label">Parlay Won</span>
                    <v-select v-model="parlay.won" :items="wonOptions" item-text="text" item-value="value" outlined dense
                        class="text-field" @change="updateParlayPayout" />
                </div>
                <div v-if="parlay.won === false">
                    <span class="text-field-label">Parlay Push</span>
                    <v-checkbox v-model="parlay.push" />
                </div>
                <div v-else-if="parlay.won">
                    <div>
                        <NumberField field-title="Payout Value" :field-value="parlay.payout"
                            :type="numberFieldEnum.Currency" @update="(value) => parlay.payout = value" />
                    </div>
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
                                    {{ `${b.teamA} x ${b.teamB}` }}
                                </td>
                                <td>
                                    {{ getBetPrediction(b) }}
                                </td>
                                <td>
                                    <v-icon color="#41b883" @click="editBetClick(b, i)">mdi-pencil</v-icon>
                                    <v-icon color="red" class="ml-2" @click="removeBetClick(i)">mdi-trash-can</v-icon>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <v-form ref="betForm" lazy-validation @submit.stop.prevent="saveBetClick">
                    <v-row v-if="bet" align="center" class="mt-6">
                        <v-col cols="12" md="6">
                            <span class="text-field-label">Sport</span>
                            <v-combobox v-model="bet.sport" :items="sportsChain" :return-object="false" item-text="name"
                                item-value="name" outlined dense :rules="[validationService.required(bet.sport)]"
                                class="text-field" @change="sportChanged" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <span class="text-field-label">League</span>
                            <v-combobox v-model="bet.league" :items="leagueOptions" :return-object="false" item-text="name"
                                item-value="name" outlined dense :rules="[validationService.required(bet.league)]"
                                class="text-field" @change="leagueChanged" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <span class="text-field-label">Team A</span>
                            <v-combobox v-model="bet.teamA" :items="teamOptions.filter((x) => x != bet.teamB)" outlined
                                dense :rules="[validationService.required(bet.teamA)]" class="text-field" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <span class="text-field-label">Team B</span>
                            <v-combobox v-model="bet.teamB" :items="teamOptions.filter((x) => x != bet.teamA)" outlined
                                dense :rules="[validationService.required(bet.teamB)]" class="text-field" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <span class="text-field-label">Event Date</span>
                            <v-text-field v-model="bet.date" outlined dense hint="YYYY-MM-DD" :rules="[
                                validationService.required(bet.date),
                                validationService.validDate(bet.date),
                            ]" class="text-field" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <span class="text-field-label">Bet Type</span>
                            <v-select v-model="bet.type" :items="betTypeOptions" outlined dense
                                :rules="[validationService.required(bet.type)]" class="text-field"
                                @change="betTypeChanged" />
                        </v-col>
                        <v-col v-if="['Player Prop', 'Spread', 'Total'].includes(bet.type)" cols="12" md="6">
                            <!-- Bet Details -->
                            <div v-if="bet.type == 'Player Prop'">
                                <span class="text-field-label">Player</span>
                                <v-text-field v-model="bet.details.player" outlined dense class="text-field"></v-text-field>
                            </div>
                            <NumberField v-else-if="bet.type == 'Spread'" field-title="Spread" :type="numberFieldEnum.Line"
                                :field-value="bet.details.spread" @update="(value) => (bet.details.spread = value)" />
                            <NumberField v-else-if="bet.type == 'Total'" field-title="Line" :field-value="bet.details.line"
                                :type="numberFieldEnum.Line" @update="(value) => (bet.details.line = value)" />
                        </v-col>
                        <v-col cols="12" md="6">
                            <!-- Bet Prediction  -->
                            <span class="text-field-label">Prediction</span>
                            <v-select v-if="bet.type == 'Total'" v-model="bet.prediction" :items="totalPredictionOptions"
                                outlined dense :rules="[validationService.required(bet.prediction)]" class="text-field" />
                            <v-select v-else-if="bet.type == 'Moneyline' || bet.type == 'Spread'" v-model="bet.prediction"
                                :items="getWinnerOptions()" item-text="text" item-value="value" outlined dense
                                :rules="[validationService.required(bet.prediction)]" class="text-field" />
                            <v-select v-else-if="bet.type == 'Both Score'" v-model="bet.prediction"
                                :items="bothScorePredictionOptions" outlined dense
                                :rules="[validationService.required(bet.prediction)]" class="text-field" />
                            <v-text-field v-else v-model="bet.prediction" outlined dense class="text-field"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row no-gutters align="center" justify="center" class="mt-3">
                        <v-btn v-if="bet" color="#41b883" dark type="submit">
                            <font-awesome-icon :icon="['fa', 'floppy-disk']" style="color: white; margin-right: 8px" />
                            Save Bet
                        </v-btn>
                        <v-btn v-else color="#41b883" dark @click="addBetClick">
                            <font-awesome-icon :icon="['fa', 'plus']" style="color: white; margin-right: 8px" />
                            Add Bet
                        </v-btn>
                        <v-btn v-if="bet" color="red" class="ml-2" dark @click="resetNewBet">
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