<template>
  <SuraHeader
    :title="`${suraNumber} ${suraName} `"
    :numberOfVerses="numberOfVerses"
    :numberOfWords="numberOfWords"
    :numberOfLetters="numberOfLetters"
  />
  <SuraBoard
    :tabs="tabs"
    v-model:search="search"
    :suraName="suraName"
    :suraWithTashkeel="suraWithTashkeel"
    :versesBasics="versesBasics"
    :chartFreqSeries="chartFreqSeries"
    :chartOptions="chartOptions"
    @verseSelected="handleVerseSelectedOnTable"
  />
  <VerseDetails
    v-model="showVerseDetails"
    :verse="selectedVerseText"
    :title="fileName"
    :inputText="search"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
import getChartOptions from "@/assets/frequecyOptions"
import { useInputFiltering } from "@/mixins/inputFiltering"
import {
  prepareSuraData,
  prepareMushafData,
  setSuraToolTip,
  setMushafToolTip,
} from "@/utils/suraUtils"

const { search } = useInputFiltering()
const props = defineProps(["suraInputText"])
const store = useStore()
const dataStore = useDataStore()
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
const suraDetails = ref({})
const selectedVerseText = ref("")
const showVerseDetails = ref(false)

const isMobileView = computed(() => store.getVersesMobileView)
const tabs = computed(() => [
  { title: "نص", name: "suraText", icon: "mdi-text-box-outline" },
  {
    title: "تفصيل",
    value: numberOfVerses,
    name: "versesTab",
    icon: isMobileView.value ? "mdi-format-list-bulleted" : "mdi-view-list",
  },
  { title: "تواتر", name: "frequency", icon: "mdi-chart-bar" },
])

const fileName = computed(() => store.getTarget?.fileName || "001الفاتحة")
const suraNumber = computed(() => parseInt(store.getTarget?.suraNumber))
const suraName = computed(() => store.getTarget?.suraName)
const targetTarteel = computed(() => store.getTarget?.tarteel)

const tableQuranIndex = computed(() => dataStore.getQuranIndex)

const suraKeyValues = computed(
  () => tableQuranIndex.value[suraNumber.value] || tableQuranIndex.value[1]
)
const chartOptions = computed(() => getChartOptions(suraTextArray.value.length))
const chartFreqType = computed(() => store.getChartFreqType)
const chartFreqSeries = computed(() =>
  chartFreqType.value === "words" ? wordsSeries.value : letterSeries.value
)

const oneQuranFile = computed(() => dataStore.getOneQuranFile)
const allVersesWithTashkeel = computed(() => dataStore.getAllVersesWithTashkeel)

const tooltipLabel = computed(() => {
  return chartFreqType.value === "words" ? "كلمة" : "حرف"
})

const tooltipLabel2 = computed(() => {
  return fileName.value !== "000المصحف" ? "آية" : "سورة"
})

const handleVerseSelectedOnTable = (verse) => {
  selectedVerseText.value = verse.verseText
  showVerseDetails.value = true
}

const setSuraBasics = () => {
  numberOfLetters.value = suraKeyValues.value.numberOfLetters
  numberOfVerses.value = suraKeyValues.value.numberOfVerses
  numberOfWords.value = suraKeyValues.value.numberOfWords
  startIndex.value = suraKeyValues.value.verseNumberToQuran - 1
  endIndex.value = suraKeyValues.value.numberOfVerses + startIndex.value
}

const fetchSuraDetails = async () => {
  // suraDetails.value = await store.getSuraDetails()
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
  setSuraToolTip({
    reversedSuraTextArray: suraTextArray.value.reverse(),
    tooltipLabel,
    tooltipLabel2,
    chartOptions,
  })
}

watch(fileName, prepareData)

onMounted(() => {
  search.value = props.suraInputText || targetTarteel.value || ""
  store.setActiveRoute("sura")
  prepareData()
})
</script>

<style lang="scss"></style>
