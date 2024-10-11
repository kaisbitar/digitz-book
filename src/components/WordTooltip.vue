<template>
  <v-tooltip
    :open-on-hover="false"
    open-on-click
    location="bottom"
    v-model="showWordMeaningTip[wordIndex]"
  >
    <template v-slot:activator="{ props }">
      <span v-bind="props" @click="handleClickedWord(word)">
        <span
          v-if="word.includes(inputText)"
          :class="{ 'text-purple-darken-1': clickedWords[wordIndex] }"
        >
          {{ word.split(inputText)[0]
          }}<span class="highlight-match">{{ inputText }}</span
          >{{ word.split(inputText)[1] }}
        </span>
        <span
          v-else
          :class="{ 'text-purple-darken-1': clickedWords[wordIndex] }"
        >
          {{ word }}
        </span>
      </span>
    </template>

    <div class="tooltip-meaning" v-if="currentMeaning">
      <h4>{{ word }}</h4>
      <p v-for="(meaning, index) in currentMeaning.slice(0, 3)" :key="index">
        <v-divider class="my-2"></v-divider>
        <strong>{{ meaning.word }}: </strong>
        {{ meaning.meaning }}<br />
        <em>المصدر: {{ meaning.dictionary }}</em>
      </p>
      <v-divider class="my-2"></v-divider>
      <v-btn @click="openDialog">المزيد..</v-btn>
    </div>
    <v-progress-circular
      v-if="loadingWords[wordIndex]"
      indeterminate
      color="primary"
      size="20"
    ></v-progress-circular>
  </v-tooltip>

  <AppDialog
    :modelValue="showWordMeaningDialog"
    @update:modelValue="showWordMeaningDialog = false"
    :closingBarData="closingBarData"
  >
    <WordMeaning :word="currentWord" :meanings="meanings[currentWord] || []" />
  </AppDialog>
</template>

<script setup>
import { fetchWordMeaning, fetchWordRoot } from "@/api/api.js"
import { extractFromDictionnary } from "@/utils/dictionaryUtils.js"

const props = defineProps({
  word: {
    type: String,
    required: true,
  },
  wordIndex: {
    type: Number,
    required: true,
  },
  closeTootip: {
    type: Boolean,
    required: false,
  },
  inputText: {
    type: String,
    required: false,
  },
  wordSelectedOnChart: {
    type: Array,
    required: false,
  },
})

const emit = defineEmits(["update:clickedWordIndex"])

const showWordMeaningTip = reactive({})
const clickedWords = reactive({})
const loadingWords = reactive({})
const meanings = reactive({})

const currentMeaning = ref("")
const currentWord = ref("")
const showWordMeaningDialog = ref(false)

const closingBarData = computed(() => ({
  inputText: currentWord,
}))
const closeLastTooltips = (index) => {
  showWordMeaningTip[index] = false
}
const closeAllTooltips = () => {
  Object.keys(showWordMeaningTip).forEach((word) => {
    showWordMeaningTip[word] = false
  })
}
defineExpose({ closeAllTooltips, closeLastTooltips })

const handleClickedWord = async (word) => {
  emit("update:clickedWordIndex", props.wordIndex)
  setCurrentWord(word)
  fetchWordData(word)
}

const setCurrentWord = (word) => {
  currentMeaning.value = ""
  clickedWords[props.wordIndex] = true
  currentWord.value = word
}

const fetchWordData = async (word) => {
  loadingWords[props.wordIndex] = true
  const wordRoot = await fetchWordRootData(word)
  await fetchWordMeaningData(word, wordRoot)
  loadingWords[props.wordIndex] = false
}

const fetchWordRootData = async (word) => {
  if (word.startsWith("ال")) return word
  const wordRootsApi = import.meta.env.VITE_WORD_ROOTS_API_URL
  const root = await fetchWordRoot(wordRootsApi, word)
  if (!root.words[0].root) return word
  return root.words[0].root
}

const fetchWordMeaningData = async (word, wordRoot) => {
  const appApi = import.meta.env.VITE_APP_API_URL

  if (!meanings[word]) {
    const response = await fetchWordMeaning(appApi, wordRoot)
    meanings[word] = extractFromDictionnary(response[0], wordRoot)
  }

  updateCurrentMeaning(meanings[word])
}

const updateCurrentMeaning = (meaningsArray) => {
  const selectedMeanings = getLimitedMeanings(meaningsArray, 300)
  currentMeaning.value = selectedMeanings
  loadingWords[currentWord.value] = false
}

const getLimitedMeanings = (meaningsArray, limit) => {
  return meaningsArray.map((item) => {
    const limitedMeaning =
      item.meaning.length > limit
        ? item.meaning.substring(0, limit) + "..."
        : item.meaning

    return {
      ...item,
      meaning: limitedMeaning,
    }
  })
}

const openDialog = () => {
  showWordMeaningDialog.value = true
}
</script>

<style scoped>
.tooltip-meaning {
  max-width: 482px;
  position: relative !important;
  pointer-events: auto;
}

.word {
  display: inline-block;
  margin: 0 4px;
  cursor: pointer;
  transition: color 0.3s;
  font-size: 25px;
}

.word:hover {
  color: #007bff;
}
</style>
