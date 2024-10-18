<template>
  <v-text-field
    v-model="searchValue"
    :label="`ابحث في ${fieldPlaceHolder}`"
    append-inner-icon="mdi-magnify"
    density="compact"
    clearable
    autofocus
    @click:clear="handleClear"
    :style="{ maxWidth: '500px' }"
  >
    <template #prepend-inner>
      <span class="text-caption">{{ dataToShow }}</span>
    </template>
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

const emit = defineEmits(["update:fieldInput", "clear"])

const searchValue = computed({
  get: () => props.fieldInput,
  set: (value) => emit("update:fieldInput", value),
})

const handleClear = () => {
  emit("clear")
}
</script>
