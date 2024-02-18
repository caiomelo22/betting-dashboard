<template>
    <v-card>
        <v-card-title>Manage Bet</v-card-title>
        <v-form ref="form" lazy-validation @submit.stop.prevent="submit">
            <v-card-text>
                <div>
                    <span class="text-field-label">Sport</span>
                    <v-combobox v-model="bet.sport" :items="sportsChain" :return-object="false" item-text="name"
                        item-value="name" outlined dense :rules="[validationService.required(bet.sport)]" class="text-field"
                        @change="sport_changed" />
                </div>
                <div>
                    <span class="text-field-label">League</span>
                    <v-combobox v-model="bet.league" :items="leagueOptions" :return-object="false" item-text="name"
                        item-value="name" outlined dense :rules="[validationService.required(bet.league)]"
                        class="text-field" @change="league_changed" />
                </div>
                <div>
                    <span class="text-field-label">Team A</span>
                    <v-combobox v-model="bet.teamA" :items="teamOptions.filter((x) => x != bet.teamB)" outlined dense
                        :rules="[validationService.required(bet.teamA)]" class="text-field" />
                </div>
                <div>
                    <span class="text-field-label">Team B</span>
                    <v-combobox v-model="bet.teamB" :items="teamOptions.filter((x) => x != bet.teamA)" outlined dense
                        :rules="[validationService.required(bet.teamB)]" class="text-field" />
                </div>
                <div>
                    <span class="text-field-label">Event Date</span>
                    <v-text-field v-model="bet.eventDate" outlined dense hint="YYYY-MM-DD" :rules="[
                        validationService.required(bet.eventDate),
                        validationService.validDate(bet.eventDate),
                    ]" class="text-field" />
                </div>
                <div>
                    <NumberField field-title="Value" :field-value="bet.value" :type="numberFieldEnum.Currency"
                        @update="(value) => (bet.value = value)" />
                </div>
                <div>
                    <NumberField field-title="Odds" :field-value="bet.odds" :type="numberFieldEnum.Odds"
                        @update="(value) => (bet.odds = value)" />
                </div>
                <div>
                    <span class="text-field-label">Bet Type</span>
                    <v-select v-model="bet.type" :items="betTypeOptions" outlined dense @change="bet_type_changed"
                        :rules="[validationService.required(bet.type)]" class="text-field" />
                </div>
                <div v-if="bet.type != 'Total'">
                    <span class="text-field-label">Prediction</span>
                    <v-select v-if="bet.type == 'Moneyline' || bet.type == 'Spread'" v-model="bet.prediction"
                        :items="get_winner_options()" item-text="text" item-value="value" outlined dense
                        :rules="[validationService.required(bet.prediction)]" class="text-field"
                        @change="winner_prediction_changed" />
                    <v-select v-else-if="bet.type == 'Both Score'" v-model="bet.prediction"
                        :items="bothScorePredictionOptions" outlined dense
                        :rules="[validationService.required(bet.prediction)]" class="text-field" />
                    <NumberField v-if="bet.type == 'Spread'" field-title="Spread" :type="numberFieldEnum.Line"
                        :field-value="bet.details.spread" @update="(value) => (bet.details.spread = value)" />
                </div>
                <div v-else-if="bet.type == 'Total'">
                    <div>
                        <NumberField field-title="Line" :type="numberFieldEnum.Line" :field-value="bet.details.line"
                            @update="(value) => (bet.details.line = value)" />
                    </div>
                    <div>
                        <span class="text-field-label">Prediction</span>
                        <v-select v-model="bet.prediction" :items="total_prediction_options" outlined dense
                            :rules="[validationService.required(bet.prediction)]" class="text-field" />
                    </div>
                </div>
                <div>
                    <span class="text-field-label">Bet Won</span>
                    <v-select v-model="bet.won" :items="won_options" item-text="text" item-value="value" outlined dense
                        class="text-field" />
                </div>
                <div v-if="bet.won === false">
                    <span class="text-field-label">Bet Push</span>
                    <v-checkbox v-model="bet.push" />
                </div>
                <div v-else-if="bet.won">
                    <span class="text-field-label">Early Payout</span>
                    <v-checkbox v-model="bet.earlyPayout" />
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