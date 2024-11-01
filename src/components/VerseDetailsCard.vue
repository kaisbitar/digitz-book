<template>
  <v-card variant="text" class="pa-1">
    <v-card-subtitle class="mt-1 mb-n1">
      <span class="text-h4 mr-3 count-key-item">
        <span class="text-caption ml-n1 count-key-item">آية</span>
        {{ verse.verseIndex }}
      </span>

      <span class="text-h4 mr-3 count-key-item">
        <span class="text-caption ml-n1 count-key-item">مصحف</span>
        {{ verse.verseNumberToQuran }}
      </span>
    </v-card-subtitle>
    <v-card-text>
      <VerseDetailsWords
        :verse="verse.verseText"
        :inputText="inputText"
        :wordSelectedOnChart="wordSelectedOnChart"
        @wordClicked="handleWordClick"
        @update:currentWord="currentWord = $event"
        @update:currentMeaning="meaningToDisplay = $event"
      />
    </v-card-text>

    <v-card-subtitle>
      <span class="text-h4 mr-3 count-key-item">
        {{ countVerseWords(verse.verseText) }}
        <span class="text-caption mr-n1 count-key-item">كلمة</span>
      </span>

      <span class="text-h4 mr-3 count-key-item">
        {{ countVerseLetters(verse.verseText) }}
        <span class="text-caption mr-n1 count-key-item">حرف</span>
      </span>
    </v-card-subtitle>
  </v-card>

  <v-card
    class="verse-details-overflow pa-1 mt-3"
    variant="outlined"
    max-width="500"
  >
    <WordMeaningCard :meanings="meaningToDisplay" />
  </v-card>
</template>

<script setup>
import { useCounting } from "@/mixins/counting"

const { countVerseWords, countVerseLetters } = useCounting()

const meaningToDisplay = ref([])
const currentWord = ref("")
const showMeaning = ref(true)

defineProps({
  verse: {
    type: Object,
    required: true,
  },
  inputText: {
    type: String,
    required: false,
  },
  wordSelectedOnChart: {
    type: Array,
    required: true,
  },
})

const handleWordClick = () => {
  showMeaning.value = !showMeaning.value
}
</script>

<style scoped>
.verse-details-overflow {
  height: calc(100vh - 400px);
  overflow: auto;
}
</style>
