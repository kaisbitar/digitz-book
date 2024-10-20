<template>
  <v-text-field
    v-model="searchValue"
    :label="`ترتيل ${fieldPlaceHolder}`"
    append-inner-icon="mdi-magnify"
    density="compact"
    clearable
    autofocus
    @click:clear="handleClear"
    :style="{ maxWidth: '300px' }"
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
    type: [Number, String],
    default: "",
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
