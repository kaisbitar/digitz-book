<template>
  <!-- <div v-click-outside="onClickOutside"> -->
  <div
    v-for="(word, index) in verseWords"
    :key="index"
    class="word ml-0 mr-1"
    :class="{
      'text-blue-darken-4':
        index === wordSelectedOnChart[wordSelectedOnChart.length - 1],
    }"
    @click="handleWordClick(index)"
  >
    <!-- <WordTooltip
        ref="wordTooltips"
        :word="word"
        :wordIndex="index"
        :inputText="inputText"
        :wordSelectedOnChart="wordSelectedOnChart"
        :closeTootip="closeTootip"
        :currentWord="currentWord"
        :currentMeaning="currentMeaning"
        :loading="loading"
        :meanings="meanings[word]"
        @update:clickWordIndex="handleWordClick"
        @update:hoverWordIndex="handleWordHover"
      /> -->
    <span v-html="highlight(word, inputText)"></span>
  </div>
  <!-- <TarteelWordMeaning
      :word="currentWord"
      :expanded="true"
      class="tarteel-meaning-overflow"
    /> -->
  <!-- </div> -->
</template>

<script setup>
import {
  fetchWordRootData,
  fetchWordMeaningData,
} from "@/utils/dictionaryUtils.js"
import { useStore } from "@/stores/appStore"
import { useInputFiltering } from "@/mixins/inputFiltering"

const { highlight } = useInputFiltering()

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
    default: "",
  },
})
const emit = defineEmits([
  "update:currentMeaning",
  "update:currentWord",
  "wordClicked",
])

const closeTootip = ref(false)
const loading = ref(false)
const wordTooltips = ref([])
const lastClickedWordIndex = ref(null)

const store = useStore()
const meanings = ref({})
const currentMeaning = ref([])
const currentWord = ref("")

const verseWords = computed(() => props.verse.split(" "))
const storedMeaning = computed(() => ({
  get: (word) => store.getWordMeaning(word),
  has: (word) => !!store.getWordMeaning(word),
}))

const fetchWordData = async (word, index) => {
  if (storedMeaning.value.has(word)) {
    currentMeaning.value = store.getWordMeaning(word)
    return
  }

  const wordRoot = await fetchWordRootData(word)
  const extractedMeaning = await fetchWordMeaningData(word, wordRoot)

  if (extractedMeaning && extractedMeaning[0]?.meaning?.length > 0) {
    store.setWordMeaning(word, extractedMeaning[0].meaning)
  }

  meanings[word] = extractedMeaning
  updateCurrentMeaning(meanings[word])
}

const updateCurrentMeaning = (meaningsArray) => {
  const selectedMeanings = getLimitedMeanings(meaningsArray, 300)
  currentMeaning.value = selectedMeanings
}

const getLimitedMeanings = (meaningsArray, limit) => {
  return meaningsArray.map((item) => ({
    ...item,
    meaning:
      item.meaning.length > limit
        ? item.meaning.substring(0, limit) + "..."
        : item.meaning,
  }))
}

const setCurrentWord = (word) => {
  currentMeaning.value = []
  currentWord.value = word
}

const handleWordClick = async (index) => {
  const word = verseWords.value[index]
  setCurrentWord(word)
  emit("wordClicked")
  await fetchWordData(word, index)
}

const handleWordHover = async (index) => {
  loading.value = true
  if (lastClickedWordIndex.value === index) return
  wordTooltips.value[lastClickedWordIndex.value]?.closeLastTooltips(
    lastClickedWordIndex.value
  )
  lastClickedWordIndex.value = index

  const word = verseWords.value[index]
  setCurrentWord(word)
  await fetchWordData(word, index)
  loading.value = false
}

const onClickOutside = () => {
  wordTooltips.value.forEach((tooltip) => {
    if (tooltip) {
      tooltip.closeAllTooltips()
    }
  })
}

watch(currentMeaning, async (newVal) => {
  await nextTick()
  emit("update:currentMeaning", newVal)
})

watch(currentWord, async (newVal) => {
  await nextTick()
  emit("update:currentWord", newVal)
})

onMounted(() => {
  setCurrentWord(verseWords.value[0])
})
</script>

<style lang="scss">
.word {
  display: inline-block;
  margin: 0 4px;
  cursor: pointer;
  font-size: 22px;
}
</style>
