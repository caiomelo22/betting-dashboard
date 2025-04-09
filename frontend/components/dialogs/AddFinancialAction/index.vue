<template>
    <v-card class="pa-4">
        <p class="mb-0"><b>Add Financial Action</b></p>
        <span>If you withdrew money, just type a minus followed by the amount you withdrew.</span>
        <p>Ex: $-100</p>
        <v-form lazy-validation @submit.stop.prevent="update_value">
            <NumberField
field-title="Value" :field-value="value" :type="numberFieldEnum.Currency"
                @update="editedValue => value = editedValue"
/>
            <v-row no-gutters justify="end">
                <v-btn color="red" dark dense @click="$emit('close')">Cancel</v-btn>
                <v-btn color="primary" class="ml-2" dense type="submit">Save</v-btn>
            </v-row>
        </v-form>
    </v-card>
</template>
<script src="./index"></script>