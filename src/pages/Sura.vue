<template>
  <AppTabs
    :title="fileName"
    :tabs="tabs"
    :activeTab="activeTab"
    @tabChanged="changeTab"
  />
  <AppInputField
    :fieldInput="search"
    :fieldPlaceHolder="fileName"
    :prepend-icons="[{ name: 'mdi-star-shooting', event: 'search' }]"
    @update:fieldInput="updateSearchValue"
  />
  <SuraText
    v-if="activeTab === 'suraText'"
    :inputText="search"
    :suraTextArray="suraWithTashkeel"
  />
  <TableVerses
    v-if="activeTab === 'versesTab'"
    :verses="versesBasics"
    :versesInputText="search"
    :fieldPlaceHolder="fileName"
    @verseSelected="handleVerseSelected"
  />
  <SuraFrequency
    v-if="activeTab === 'frequency'"
    :chartFreqSeries="chartFreqSeries"
    :chartOptions="chartOptions"
    :versesText="suraTextArray"
    :height="chartWindowHeight"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"
import chartOptionsConfig from "@/assets/frequecyOptions"
import { useInputFiltering } from "@/mixins/inputFiltering"
import {
  prepareSuraData,
  prepareMushafData,
  setSuraToolTip,
  setMushafToolTip,
} from "@/utils/suraUtils"

const { updateSearchValue, search } = useInputFiltering()
const props = defineProps(["suraInputText"])
const store = useQuranStore()

const chartOptions = ref(chartOptionsConfig)
const suraWithTashkeel = ref([])
const numberOfLetters = ref(null)
const numberOfVerses = ref(null)
const numberOfWords = ref(null)
const startIndex = ref(null)
const endIndex = ref(null)
const suraTextArray = ref([])
const versesBasics = ref([])
const letterSeries = ref([{ data: [] }])
const versesSeries = ref([{ data: [] }])
const wordsSeries = ref([{ data: [] }])
const details = ref({})

const tabs = computed(() => [
  { title: "سياق", name: "suraText" },
  { title: "آية", value: numberOfVerses.value, name: "versesTab" },
  { title: "كلمة", value: numberOfWords.value, name: "wordsTab" },
  { title: "حرف", value: numberOfLetters.value, name: "lettersTab" },
  { title: "تواتر", name: "frequency" },
])
const chartWindowHeight = computed(() => window.innerHeight - 260)
const fileName = computed(() => store.getTarget?.fileName || "001الفاتحة")
const suraNumber = computed(() => parseInt(fileName.value.replace(/^\D+/g, "")))
const tableQuranIndex = computed(() => store.getQuranIndex)
const suraKeys = computed(
  () => tableQuranIndex.value[suraNumber.value] || tableQuranIndex.value[1]
)
const chartFreqType = computed(() => store.getChartFreqType)
const chartFreqSeries = computed(() =>
  chartFreqType.value === "words" ? wordsSeries.value : letterSeries.value
)
const oneQuranFile = computed(() => store.getOneQuranFile)
const allVersesWithTashkeel = computed(() => store.getAllVersesWithTashkeel)

const tooltipLabel = computed(() => {
  return chartFreqType.value === "words" ? "كلمات" : "حرف"
})

const tooltipLabel2 = computed(() => {
  return fileName.value !== "000المصحف" ? "آية" : "سورة"
})

const activeTab = computed({
  get: () => store.getActiveSuraTab,
  set: (value) => store.setActiveSuraTab(value),
})

const handleVerseSelected = (verse) => {
  store.setActiveSuraTab("suraText")
}

const changeTab = (tab) => {
  store.setActiveSuraTab(tab)
}

const setSuraBasics = () => {
  numberOfLetters.value = suraKeys.value.numberOfLetters
  numberOfVerses.value = suraKeys.value.numberOfVerses
  numberOfWords.value = suraKeys.value.numberOfWords
  startIndex.value = suraKeys.value.verseNumberToQuran - 1
  endIndex.value = suraKeys.value.numberOfVerses + startIndex.value
}

const fetchSuraDetails = async () => {
  details.value = await store.getSuraDetails()
}

const prepareData = () => {
  setSuraBasics()
  fetchSuraDetails()
  if (fileName.value === "000المصحف") {
    prepareMushafData({
      oneQuranFile,
      versesBasics,
      suraTextArray,
      letterSeries,
      versesSeries,
      wordsSeries,
      tableQuranIndex,
    })
    suraWithTashkeel.value = allVersesWithTashkeel.value
    setMushafToolTip({ tableQuranIndex, setSuraToolTip })
    return
  }
  prepareSuraData({
    oneQuranFile,
    startIndex,
    endIndex,
    versesBasics,
    suraTextArray,
    letterSeries,
    wordsSeries,
  })
  suraWithTashkeel.value = allVersesWithTashkeel.value.slice(
    startIndex.value,
    endIndex.value
  )
  setSuraToolTip({ suraTextArray, tooltipLabel, tooltipLabel2, chartOptions })
}

watch(fileName, prepareData)

onMounted(() => {
  search.value = props.suraInputText
  store.setActiveRoute("sura")
  prepareData()
})
</script>

<style lang="scss"></style>
