<template>
  <div>
    <span v-if="fieldTitle" class="text-field-label">{{ fieldTitle }}</span>
    <div :class="{ 'col-flex': type == numberFieldEnum.Currency }">
      <v-text-field
        v-model="value"
        :prefix="type == numberFieldEnum.Currency ? '$' : ''"
        outlined
        dense
        :rules="required ? [validationService.required(value)] : []"
        type="number"
        class="text-field"
        :disabled="disabled"
      />
    </div>
  </div>
</template>
<script src="./index.js"></script>
