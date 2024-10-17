<template>
  <v-text-field
    v-model="searchValue"
    :label="`ابحث في ${fieldPlaceHolder}`"
    :style="{ maxWidth: '500px' }"
    append-inner-icon="mdi-magnify"
    density="compact"
    hide-details
    single-line
    clearable
    class="mx-2"
    autofocus
  >
    <template #append> {{ dataToShow }} آية </template>
  </v-text-field>
</template>

<script setup>
import { ref, computed, watch } from "vue"

const props = defineProps({
  fieldInput: {
    type: String,
    default: "",
  },
  fieldPlaceHolder: {
    type: String,
    required: true,
  },
  dataToShow: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(["update:fieldInput"])

const searchValue = computed({
  get: () => props.fieldInput,
  set: (value) => emit("update:fieldInput", value),
})
</script>
