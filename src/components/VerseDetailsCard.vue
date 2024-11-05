<template>
  <VerseNumbers
    :verse-index="parseInt(verse.verseIndex)"
    :verse-number-to-quran="parseInt(verse.verseNumberToQuran)"
  />
  <VerseDetailsWords
    :verse="verse.verseText"
    :inputText="inputText"
    :currentWord="currentWord"
    @update:currentWord="$emit('update:currentWord', $event)"
    @update:currentMeaning="$emit('update:currentMeaning', $event)"
    @update:loading="$emit('update:loading', $event)"
  />
  <VerseStats
    class="mt-2"
    :number-of-words="parseInt(countVerseWords(verse.verseText))"
    :number-of-letters="parseInt(countVerseLetters(verse.verseText))"
  />
</template>

<script setup>
import { useCounting } from "@/mixins/counting"
import VerseNumbers from "./VerseNumbers.vue"

const { countVerseWords, countVerseLetters } = useCounting()

const emit = defineEmits([
  "update:currentMeaning",
  "update:currentWord",
  "update:loading",
])

defineProps({
  verse: {
    type: Object,
    required: true,
  },
  inputText: {
    type: String,
    required: false,
  },
  currentWord: {
    type: String,
    required: false,
  },
})
</script>

<style scoped>
.verse-details-overflow {
  height: calc(100vh - 400px);
  overflow: auto;
}
</style>
