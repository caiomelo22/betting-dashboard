<template>
    <v-container>
        <div v-if="loading" class="row">
            <v-progress-circular size="20" color="#41b883" indeterminate />
        </div>
        <div v-else>
            <div class="row">
                <v-btn color="#41b883" dark @click="dialog = true">
                    <font-awesome-icon :icon="['fa', 'plus']" style="color: white; margin-right: 8px" />
                    Add Parlay
                </v-btn>
            </div>
            <div class="table-wrapper">
                <table class="data-table mt-0">
                    <thead>
                        <th v-for="(header, i) in parlays_headers" :key="i">{{ header }}</th>
                    </thead>
                    <tbody>
                        <template v-for="(parlay, i) in parlays">
                            <tr :key="`${i} Main`">
                                <!-- Actions -->
                                <td>
                                    <v-btn icon color="primary" @click="editClick(parlay)">
                                        <v-icon primary small>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn icon color="red" @click="deleteClick(parlay)">
                                        <v-icon primary small>mdi-trash-can</v-icon>
                                    </v-btn>
                                    <v-btn icon color="#41b883" @click="detailsClick(parlay)">
                                        <v-icon primary small>mdi-eye</v-icon>
                                    </v-btn>
                                </td>
                                <!-- Date -->
                                <td>
                                    {{ generalServices.formatDate(parlay.date) }}
                                </td>
                                <!-- Description -->
                                <td>
                                    {{ getParlayDescription(parlay) }}
                                </td>
                                <!-- Value -->
                                <td>
                                    {{ generalServices.formatValue(parlay.value) }}
                                </td>
                                <!-- Odds -->
                                <td>
                                    {{ parlay.odds }}
                                </td>
                                <!-- Won -->
                                <td>
                                    <font-awesome-icon v-if="parlay.won === null" :icon="['fa', 'arrows-rotate']"
                                        style="color: #9FC9F3" />
                                    <font-awesome-icon v-else-if="parlay.push" :icon="['fa', 'minus']"
                                        style="color: #FF6E31" />
                                    <font-awesome-icon v-else-if="parlay.won || parlay.earlyPayout" :icon="['fa', 'check']"
                                        style="color: green" />
                                    <font-awesome-icon v-else :icon="['fa', 'xmark']" style="color: red" />
                                </td>
                                <!-- Profit -->
                                <td>
                                    {{ getParlayProfit(parlay) }}
                                </td>
                            </tr>
                            <div v-if="showParlayDetails == parlay" :key="`${i} Details`"
                                style="width: 100%; display: table-row; border: 1px solid #DADADA">
                                <td colspan="12">
                                    <div v-for="(bet, betIndex) in parlay.bets" :key="betIndex">
                                        <div style="color: #41b883; font-size: 18px;"
                                            :style="`border-top: ${betIndex != 0 ? '1px solid #DADADA' : 'none'}`"
                                            v-if="betIndex == 0 || (bet.teamA != parlay.bets[betIndex - 1].teamA || bet.teamB != parlay.bets[betIndex - 1].teamB)">
                                            {{ `${bet.teamA} x ${bet.teamB}` }}
                                        </div>
                                        <div>
                                            {{ `${bet.details.type}: ${getBetPrediction(bet.details.type, bet.details.details.prediction, bet.details.details)}` }}
                                        </div>
                                    </div>
                                </td>
                            </div>
                        </template>
                    </tbody>
                </table>
            </div>
            <v-pagination v-model="page" color="#41b883" :length="totalPages" style="margin-top: 16px" @input="changePage">
            </v-pagination>
        </div>
        <v-dialog v-if="dialog" v-model="dialog" max-width="100%" width="700px">
            <AddParlayDialog :sports-chain="sportsChain" :sportsbook-options="sportsbooks" :bet-type-options="betTypes.map(x => x.name)"
                @close="dialog = false" @added="parlayAdded" />
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