<template>
  <div class="text-center justify-content-center">
    <span
      v-for="(word, index) in verseWords"
      :key="index"
      class="word"
      @click="findMeaning(word)"
      :class="{
        'bg-orange-lighten-2':
          index === wordSelectedOnChart[wordSelectedOnChart.length - 1],
        clicked: clickedWords[word], // Apply 'clicked' class if the word is clicked
      }"
    >
      <span v-if="word.includes(inputText)">
        {{ word.split(inputText)[0]
        }}<span class="highlight">{{ inputText }}</span
        >{{ word.split(inputText)[1] }}
      </span>
      <span v-else>
        {{ word }}
      </span>
    </span>
  </div>
  <AppDialog
    :modelValue="showWordMeaning"
    @update:modelValue="showWordMeaning = false"
    :closingBarData="closingBarData"
  >
    <WordMeaning :word="currentWord" :meanings="meanings[currentWord] || []" />
  </AppDialog>
</template>

<script setup>
import { fetchWordMeaning, fetchWordRoot } from "@/api/api.js"
import { ref, reactive, computed } from "vue"
import { extractFromDictionnary } from "@/utils/dictionaryUtils.js"
import WordMeaning from "./WordMeaning.vue"

const props = defineProps({
  verse: {
    type: String,
    required: true,
  },
  wordSelectedOnChart: {
    type: Array,
    required: false,
  },
  inputText: {
    type: String,
    required: false,
  },
})
const meanings = reactive({})
const currentWord = ref("")
const showWordMeaning = ref(false)
const selectedWord = ref(props.wordSelectedOnChart || "")

const closingBarData = computed(() => ({
  inputText: currentWord,
}))

const verseWords = computed(() => props.verse.split(" "))

const clickedWords = reactive({}) // Track clicked state for each word

const findMeaning = async (word) => {
  clickedWords[word] = true
  currentWord.value = word
  selectedWord.value = word
  const appApi = import.meta.env.VITE_APP_API_URL
  const wordRootsApi = import.meta.env.VITE_WORD_ROOTS_API_URL
  const wordRoot = await fetchWordRoot(wordRootsApi, word)

  if (!meanings[word]) {
    const response = await fetchWordMeaning(appApi, wordRoot.words[0].root)
    meanings[word] = extractFromDictionnary(response[0], wordRoot.words[0].root)
  }
  showWordMeaning.value = true
  return meanings[word]
}
</script>

<style lang="scss">
.word {
  display: inline-block;
  margin: 0 4px;
  cursor: pointer;
  transition: color 0.3s;
  font-size: 25px;
}

.word:hover {
  color: #007bff;
  text-decoration: overline;
}

.clicked {
  // New class for clicked state
  color: #007bff; // Change color or any other styles you want
  text-decoration: underline; // Example style
}

.highlight {
  background-color: rgb(var(--v-theme-highlight));
  color: rgb(var(--v-theme-on-highlight));
}
</style>
