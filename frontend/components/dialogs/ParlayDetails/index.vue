<template>
    <v-card class="pa-4 text-center">
        <v-row no-gutters align="center" justify="center">
            <div>
                <p class="mb-0" style="font-weight: 700">Parlay Odds</p>
                <p class="mb-0">{{ parlay.odds }}</p>
            </div>
        </v-row>
        <p class="mb-0 mt-4" style="font-weight: 700">Parlay Details</p>
        <div class="table-wrapper">
            <table class="data-table mt-0">
                <thead>
                    <th v-for="(header, i) in bets_headers" :key="i">{{ header }}</th>
                </thead>
                <tbody>
                    <tr v-for="(bet, i) in parlay.bets" :key="i">
                        <td>
                            {{ generalServices.format_date(bet.match.date) }}
                        </td>
                        <td>
                            {{
        bet.match.league.name
}}
                        </td>
                        <td>
                            {{ `${bet.match.homeTeam.name} ${bet.match.homeScore != null ? bet.match.homeScore :
        ''} x ${bet.match.awayScore != null ? bet.match.awayScore : ''}
                            ${bet.match.awayTeam.name}`
}}
                        </td>
                        <td>
                            {{ bet.type }}
                        </td>
                        <td>
                            {{ get_bet_prediction(bet) }}
                        </td>
                        <td>
                            {{ bet.odds }}
                        </td>
                        <td>
                            <font-awesome-icon v-if="bet.match.homeScore == null" :icon="['fa', 'arrows-rotate']"
                                style="color: #9FC9F3" />
                            <font-awesome-icon v-else-if="bet.push" :icon="['fa', 'minus']" style="color: #FF6E31" />
                            <font-awesome-icon v-else-if="bet.won || bet.earlyPayout" :icon="['fa', 'check']"
                                style="color: green" />
                            <font-awesome-icon v-else :icon="['fa', 'xmark']" style="color: red" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <v-row no-gutters justify="center" class="mt-6">
            <v-btn color="red" dark dense @click="$emit('close')">Close</v-btn>
        </v-row>
    </v-card>
</template>
<script src="./index"></script>