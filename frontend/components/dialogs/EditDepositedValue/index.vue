<template>
  <v-card class="pa-4">
    <p class="mb-0">Total Deposited Value</p>
    <v-form lazy-validation @submit.stop.prevent="update_value">
    <v-text-field v-model="depositedValue" dense outlined />
    <v-row no-gutters justify="end">
      <v-btn color="red" dark dense @click="$emit('close')">Cancel</v-btn>
      <v-btn color="primary" class="ml-2" dense type="submit">Save</v-btn>
    </v-row>
    </v-form>
  </v-card>
</template>
<script src="./index"></script>