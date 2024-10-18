<template>
  <SuraHeader
    :title="`${suraNumber} ${suraName} `"
    :numberOfVerses="numberOfVerses"
    :numberOfWords="numberOfWords"
    :numberOfLetters="numberOfLetters"
  />
  <SuraContent
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
import { useQuranStore } from "@/stores/app"
import getChartOptions from "@/assets/frequecyOptions"
import { useInputFiltering } from "@/mixins/inputFiltering"
import {
  prepareSuraData,
  prepareMushafData,
  setSuraToolTip,
  setMushafToolTip,
} from "@/utils/suraUtils"
import SuraContent from "@/components/SuraContent.vue"

const { search } = useInputFiltering()
const props = defineProps(["suraInputText"])
const store = useQuranStore()

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
const tableQuranIndex = computed(() => store.getQuranIndex)
const suraKeyValues = computed(
  () => tableQuranIndex.value[suraNumber.value] || tableQuranIndex.value[1]
)
const chartOptions = computed(() => getChartOptions(suraTextArray.value.length))
const chartFreqType = computed(() => store.getChartFreqType)
const chartFreqSeries = computed(() =>
  chartFreqType.value === "words" ? wordsSeries.value : letterSeries.value
)

const oneQuranFile = computed(() => store.getOneQuranFile)
const allVersesWithTashkeel = computed(() => store.getAllVersesWithTashkeel)

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
  search.value = props.suraInputText || ""
  store.setActiveRoute("sura")
  prepareData()
})
</script>

<style lang="scss"></style>
