<template>
  <div class="app-count-chips" v-for="(count, key) in counts" :key="key">
    <v-chip
      v-if="shouldShowChip(count)"
      size="x-small"
      variant="tonal"
      class="ml-2"
      :class="getChipClass(key, count)"
    >
      {{ count }} {{ labels?.[key] }}
    </v-chip>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  versesCount: Number,
  wordCount: Number,
  letterCount: Number,
  verseNumberToQuran: Number,
  labels: {
    type: Object,
    required: true,
  },
})

const counts = computed(() => ({
  verse: props.versesCount,
  word: props.wordCount,
  letter: props.letterCount,
  verseNumberToQuran: props.verseNumberToQuran,
}))

const shouldShowChip = (count) => {
  return count !== undefined && (count > 0 || count === 0)
}

const getChipClass = (key, count) => {
  if (count <= 0) return "text-red"
  switch (key) {
    case "verse":
      return "verses-count"
    case "word":
      return "word-count"
    case "letter":
      return "letter-count"
    case "verseNumberToQuran":
      return "verse-number-to-quran"
    default:
      return ""
  }
}
</script>

<style></style>
