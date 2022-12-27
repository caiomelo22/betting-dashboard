<template>
    <v-container>
        <div v-if="loading" class="row">
            <v-progress-circular size="20" color="#41b883" indeterminate />
        </div>
        <div v-else>
            <div class="row">
                <v-select label="League" hide-details v-model="league_filter" :items="league_filter_options" outlined
                    dense class="text-field select-field mr-4" @change="get_bets()" />
                <v-select label="Bet Type" hide-details v-model="bet_type_filter" :items="bet_type_filter_options" outlined dense
                    class="text-field select-field mr-4" @change="get_bets()" />
                <v-btn color="#41b883" dark @click="dialog = true">
                    <font-awesome-icon :icon="['fa', 'plus']" style="color: white; margin-right: 8px" />
                    Add Bet
                </v-btn>
            </div>
            <div class="table-wrapper">
                <table class="data-table mt-0">
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
                                {{ `${bet.match.homeTeam.name} ${bet.match.scoreHomeTeam != null ?
        bet.match.scoreHomeTeam : ''} x ${bet.match.scoreAwayTeam != null ?
            bet.match.scoreAwayTeam : ''} ${bet.match.awayTeam.name}`
}}
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
                                <font-awesome-icon v-if="bet.match.scoreHomeTeam == null"
                                    :icon="['fa', 'arrows-rotate']" style="color: #9FC9F3" />
                                <font-awesome-icon v-else-if="bet.won || bet.earlyPayout" :icon="['fa', 'check']"
                                    style="color: green" />
                                <font-awesome-icon v-else :icon="['fa', 'xmark']" style="color: red" />
                            </td>
                            <td>
                                {{ get_bet_profit(bet) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <v-pagination v-model="page" color="#41b883" :length="totalPages" style="margin-top: 16px"
                @input="change_page">
            </v-pagination>
        </div>
        <v-dialog v-if="dialog" v-model="dialog" max-width="100%" width="700px">
            <AddBetDialog :leagues="leagues" @close="dialog = false" @added="bet_added" />
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