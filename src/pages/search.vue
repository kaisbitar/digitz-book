<template>
  <div>
    <AutoComplete />
    <h1 class="ml-10">{{ inputText }}</h1>
    <SearchDashboard
      v-if="!isLoading"
      :inputText="inputText"
      :chartFreqSeries="[{ data: [] }]"
      :chartOptions="chartOptions"
      :numberOfVerses="numberOfVerses"
      :numberOfWords="numberOfWords"
      :numberOfLetters="numberOfLetters"
      :isLoading="isLoading"
      :suraTextArray="suraTextArray"
      :versesBasics="versesData"
    />
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'
import chartOptions from '../assets/frequecyOptions'

const store = useQuranStore()
const props = defineProps(['activeView'])

const isLoading = ref(false)
const versesData = ref([])
const suraTextArray = ref([])
const selectedSearch = computed(() => (store.getResearchResults ? store.getSelectedSearch : {}))


const inputText = computed(() =>
  selectedSearch.value ? selectedSearch.value.inputText : undefined,
)

const oneQuranFile = computed(() => quranStore.getOneQuranFile)
const versesBasics = computed(() => (selectedSearch.value ? selectedSearch.value.result : []))
const numberOfVerses = computed(() =>
  selectedSearch.value ? selectedSearch.value.result.length : 0,
)
const numberOfWords = computed(() => {
  if (!selectedSearch.value) return 0
  return selectedSearch.value.result
    .map(item => item.raw.verseText.split(' ').length)
    .reduce((a, b) => a + b, 0)
})
const numberOfLetters = computed(() => {
  if (!selectedSearch.value) return 0
  return selectedSearch.value.result
    .map(item => item.raw.verseText.replace(/ /g, '').length)
    .reduce((a, b) => a + b, 0)
})

const createVersesData = () => {
  versesData.value = versesBasics.value.map(item => {
    return {
      fileName: item.raw.fileName,
      verseIndex: item.raw.verseIndex.toString(),
      verseText: item.raw.verseText,
      numberOfWords: item.raw.verseText.split(' ').length.toString(),
      numberOfLetters: item.raw.verseText.replace(/ /g, '').length.toString(),
      verseNumberToQuran: item.raw.verseNumberToQuran.toString(),
    }
  })
}

const perpareSuraData = () => {
  oneQuranFile.value.forEach((item, index) => {
    if (index <= startIndex.value - 1 || index >= endIndex.value) return
    suraTextArray.value.push(item.verseText)
  })
}

// Watch
watch(versesBasics, () => {
  createVersesData()
})

// Lifecycle hooks
onMounted(() => {
  store.setActiveRoute('search')
  store.setActiveView('detailView')
  createVersesData()
})
</script>

<style scoped>
.cTable {
  max-width: 600px;
}
</style>
