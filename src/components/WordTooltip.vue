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
          :class="{
            'text-purple-darken-3': clickedWords[wordIndex],
            'text-purple-lighten-3': isInStore,
          }"
        >
          {{ word.split(inputText)[0] }}
          <span class="highlight-match">{{ inputText }}</span>
          {{ word.split(inputText)[1] }}
        </span>
        <span
          v-else
          :class="{
            'text-purple-darken-3': clickedWords[wordIndex],
            'text-purple-lighten-3': isInStore,
          }"
        >
          {{ word }}
        </span>
      </span>
    </template>
    <WordTooltipDialog
      :word="word"
      :currentWord="currentWord"
      :currentMeaning="currentMeaning"
      :loading="loadingWords[wordIndex]"
      :meanings="meanings"
      :closingBarData="closingBarData"
    />
  </v-tooltip>
</template>

<script setup>
import { fetchWordMeaning, fetchWordRoot } from "@/api/api.js"
import {
  extractFromDictionnary,
  fetchWordRootData,
  fetchWordMeaningData,
} from "@/utils/dictionaryUtils.js"
import { useStore } from "@/stores/appStore.js"

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

const currentMeaning = ref([])
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

const store = useStore()

const storeWordMeanings = computed(() => ({
  get: (word) => store.getWordMeaning(word),
  has: (word) => !!store.getWordMeaning(word),
}))

const handleClickedWord = async (word) => {
  emit("update:clickedWordIndex", props.wordIndex)
  setCurrentWord(word)
  await fetchWordData(word)
}

const setCurrentWord = (word) => {
  currentMeaning.value = []
  clickedWords[props.wordIndex] = true
  currentWord.value = word
}

const fetchWordData = async (word) => {
  loadingWords[props.wordIndex] = true
  const wordRoot = await fetchWordRootData(word)

  const extractedMeaning = await fetchWordMeaningData(word, wordRoot)
  meanings[word] = extractedMeaning
  updateCurrentMeaning(meanings[word])
  loadingWords[props.wordIndex] = false
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

const quranStore = useStore()
const isInStore = ref(false)

const wordMeanings = computed(() => ({
  get: (word) => quranStore.getWordMeaning(word),
  has: (word) => !!quranStore.getWordMeaning(word),
}))

const checkIfInStore = () => {
  isInStore.value = wordMeanings.value.has(props.word)
}

onMounted(() => {
  checkIfInStore()
})
onBeforeUnmount(() => {
  checkIfInStore()
})
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
  color: #007bff !important;
}

.text-green-darken-1 {
  color: #1b5e20; /* Adjust this color as needed */
}
</style>
