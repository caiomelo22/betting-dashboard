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
                        <tr v-for="(parlay, i) in parlays" :key="i">
                            <td>
                                {{ generalServices.format_date(parlay.date) }}
                            </td>
                            <td>
                                {{ get_league(parlay) }}
                            </td>
                            <td>
                                {{ generalServices.format_value(parlay.value) }}
                            </td>
                            <td>
                                {{ parlay.odds }}
                            </td>
                            <td>
                                <font-awesome-icon v-if="!parlay.finished" :icon="['fa', 'arrows-rotate']"
                                    style="color: #9FC9F3" />
                                <font-awesome-icon v-else-if="parlay.won" :icon="['fa', 'check']"
                                    style="color: green" />
                                <font-awesome-icon v-else :icon="['fa', 'xmark']" style="color: red" />
                            </td>
                            <td>
                                {{ get_parlay_profit(parlay) }}
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
            <AddParlayDialog :leagues="leagues" @close="dialog = false" @added="parlay_added" />
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