<template>
    <v-container>
        <div v-if="loading" class="row">
            <v-progress-circular size="20" color="#41b883" indeterminate />
        </div>
        <div v-else>
            <div class="row">
                <v-select
v-model="sportFilter" label="Sport" hide-details :items="sportFilterOptions" outlined dense
                    class="text-field select-field mr-4" @change="getBets()"
/>
                <v-select
v-model="leagueFilter" label="League" hide-details :items="leagueFilterOptions" outlined dense
                    class="text-field select-field mr-4" @change="getBets()"
/>
                <v-select
v-model="betTypeFilter" label="Bet Type" hide-details :items="betTypeOptions" outlined dense
                    class="text-field select-field mr-4" @change="getBets()"
/>
                <v-btn color="#41b883" dark @click="dialog = true">
                    <font-awesome-icon :icon="['fa', 'plus']" style="color: white; margin-right: 8px" />
                    Add Bet
                </v-btn>
            </div>
            <div class="table-wrapper">
                <table class="data-table mt-0">
                    <thead>
                        <th v-for="(header, i) in betHeaders" :key="i">{{ header }}</th>
                    </thead>
                    <tbody>
                        <tr v-for="(bet, i) in bets" :key="i">
                            <td>
                                <v-btn icon color="primary" @click="editClick(bet)">
                                    <v-icon primary small>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn icon color="red" @click="deleteClick(bet)">
                                    <v-icon primary small>mdi-trash-can</v-icon>
                                </v-btn>
                            </td>
                            <td>
                                {{ generalServices.formatDate(bet.date) }}
                            </td>
                            <td>
                                {{ `${bet.teamA} x ${bet.teamB}` }}
                            </td>
                            <td>
                                {{ getBetPrediction(bet) }}
                            </td>
                            <td>
                                {{ generalServices.formatValue(bet.value) }}
                            </td>
                            <td>
                                {{ bet.odds }}
                            </td>
                            <td>
                                <font-awesome-icon
v-if="bet.won === null" :icon="['fa', 'arrows-rotate']"
                                    style="color: #9FC9F3"
/>
                                <font-awesome-icon v-else-if="bet.push" :icon="['fa', 'minus']" style="color: #FF6E31" />
                                <font-awesome-icon
v-else-if="bet.won || bet.earlyPayout" :icon="['fa', 'check']"
                                    style="color: green"
/>
                                <font-awesome-icon v-else :icon="['fa', 'xmark']" style="color: red" />
                            </td>
                            <td>
                                {{ getBetProfit(bet) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <v-pagination v-model="page" color="#41b883" :length="totalPages" style="margin-top: 16px" @input="changePage">
            </v-pagination>
        </div>
        <v-dialog v-if="dialog" v-model="dialog" max-width="100%" width="700px">
            <ManageBetDialog
:sports-chain="sportsChain" :sportsbook-options="sportsbooks" :bet-type-options="betTypes"
                :bet-prop="betToUpdate" @close="closeDialog" @added="betAdded"
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