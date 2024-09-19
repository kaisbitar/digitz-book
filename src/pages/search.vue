<template>
  <div>
    <autoComplete />
    <div class="d-flex">
      <appTitle :title="inputText" />
    </div>
    <!-- <keep-alive> -->
    <dashbord
      v-if="!isLoading"
      :inputText="inputText"
      @tabChanged="getWordsData"
      :chartFreqSeries="[{ data: [] }]"
      :chartOptions="chartOptions"
      :numberOfVerses="numberOfVerses"
      :numberOfWords="numberOfWords"
      :numberOfLetters="numberOfLetters"
      :isLoading="isLoading"
      :wordIndexes="details.wordIndexes"
      :suraTextArray="searchResults"
      :versesBasics="versesData"
      :activeTab="activeTab"
    />
    <!-- </keep-alive> -->
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'
import dashbord from '../components/dashbord.vue'
import appTitle from '../components/appTitle'
import chartOptions from '../assets/frequecyOptions'

const store = useQuranStore()

// Props
const props = defineProps(['activeView'])

// Refs
const isLoading = ref(false)
const details = ref({})
const versesData = ref([])
const suraTextArray = ref([])
const letterSeries = ref([])
const wordsSeries = ref([])
const view = ref('detailView')

// Methods
const getWordsData = tab => {
  console.log(tab)
  store.setActiveTab(tab)
  if (activeTab.value === 'numberOfWords') {
    fetchSuraDetails()
  }
}

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

const fetchSuraDetails = async () => {
  isLoading.value = true
  try {
    const items = await store.getSuraDetails()
    details.value = items
  } finally {
    isLoading.value = false
  }
}

// Computed properties
const activeTab = computed(() => store.getActiveTab)
const selectedSearch = computed(() => (store.getResearchResults ? store.getSelectedSearch : {}))
const selectedSearchIndex = computed(() => store.getSelectedSearchIndex)
const suraTargetedVerseIndex = computed(() => store.getTarget?.verseIndex || 1)

const inputText = computed(() =>
  selectedSearch.value ? selectedSearch.value.inputText : undefined,
)
const searchResults = computed(() =>
  selectedSearch.value ? selectedSearch.value.result.map(item => item.verseText) : [],
)
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

const oneQuranFile = computed(() => quranStore.getOneQuranFile)

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
