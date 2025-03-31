<template>
  <div class="d-flex mb-4">
    <v-btn
      v-if="!isWordMeaningOpen"
      icon="mdi-pencil-outline"
      variant="tonal"
      size="small"
      class="ml-auto d-block"
      @click="$emit('update:isUserNoteOpen', true)"
    />
    <div>
      <span class="text-h4 ml-4">{{ word }}</span>
      <AppHeaderMetrics :metrics="counts" />
    </div>
    <v-btn
      icon="mdi-arrow-left"
      variant="tonal"
      size="small"
      class="mr-auto d-block"
      @click="$emit('back-to-list')"
    />

    <v-btn
      v-if="isWordMeaningOpen"
      icon="mdi-close"
      variant="tonal"
      size="small"
      class="mr-auto"
      @click="$emit('update:isWordMeaningOpen', false)"
    />
  </div>
</template>

<script setup>
import { useCounting } from "@/mixins/counting"
const { calculateValue } = useCounting()

const props = defineProps({
  word: {
    type: String,
    required: true,
  },
  versesCount: {
    type: Number,
    required: true,
  },
  occurrenceCount: {
    type: Number,
    required: true,
  },
  isWordMeaningOpen: {
    type: Boolean,
    required: true,
  },
})

import { useDisplay } from "vuetify"

const display = useDisplay()

const counts = computed(() => {
  const allCounts = [
    { value: props.versesCount, label: "آية" },
    { value: props.occurrenceCount, label: "مرة" },
    { value: calculateValue(props.word), label: "مرقوم" },
  ]

  return display.xs.value ? [allCounts[0]] : allCounts
})

defineEmits([
  "update:expanded",
  "update:isWordMeaningOpen",
  "update:isUserNoteOpen",
  "back-to-list",
])
</script>
