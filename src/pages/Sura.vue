<template>
  <VerseDetails
    v-model="showVerseDetails"
    :verse="selectedVerseText"
    :title="fileName"
  />
  <SuraHeader
    :title="fileName"
    :tabs="tabs"
    :activeTab="activeTab"
    :numberOfVerses="numberOfVerses"
    :numberOfWords="numberOfWords"
    :numberOfLetters="numberOfLetters"
    @tabChanged="changeTab"
  />
  <div class="d-flex">
    <AppInputField
      :fieldInput="search"
      :fieldPlaceHolder="`سورة ${fileName}`"
      :prepend-icons="[{ name: 'mdi-star-shooting', event: 'search' }]"
      @update:fieldInput="updateSearchValue"
    />
    <AppFilterActions v-if="showFilterActions" />
  </div>
  <SuraText
    v-if="activeTab === 'suraText'"
    class="mt-n2"
    :inputText="search"
    :suraTextArray="suraWithTashkeel"
  />
  <TableVerses
    v-if="activeTab === 'versesTab'"
    :verses="versesBasics"
    :versesInputText="search"
    @verseSelected="handleVerseSelectedOnTable"
  />
  <SuraFrequency
    v-if="activeTab === 'frequency'"
    :chartFreqSeries="chartFreqSeries"
    :chartOptions="chartOptions"
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
const suraDetails = ref({})
const selectedVerseText = ref("")
const showVerseDetails = ref(false)

const isMobileView = computed(() => store.getVersesMobileView)
const tabs = computed(() => [
  { title: "سياق", name: "suraText", icon: "mdi-text-box-outline" },
  {
    title: "آية",
    value: numberOfVerses,
    name: "versesTab",
    icon: isMobileView.value ? "mdi-format-list-bulleted" : "mdi-view-list",
  },
  { title: "تواتر", name: "frequency", icon: "mdi-chart-bar" },
])
const chartWindowHeight = computed(() => window.innerHeight - 260)
const fileName = computed(() => store.getTarget?.fileName || "001الفاتحة")
const suraNumber = computed(() => parseInt(fileName.value.replace(/^\D+/g, "")))
const tableQuranIndex = computed(() => store.getQuranIndex)
const suraKeyValues = computed(
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

const showFilterActions = computed(() => {
  return activeTab.value === "versesTab"
})

const handleVerseSelectedOnTable = (verse) => {
  selectedVerseText.value = verse.verseText
  showVerseDetails.value = true
}

const changeTab = (tab) => {
  store.setActiveSuraTab(tab)
}

const setSuraBasics = () => {
  numberOfLetters.value = suraKeyValues.value.numberOfLetters
  numberOfVerses.value = suraKeyValues.value.numberOfVerses
  numberOfWords.value = suraKeyValues.value.numberOfWords
  startIndex.value = suraKeyValues.value.verseNumberToQuran - 1
  endIndex.value = suraKeyValues.value.numberOfVerses + startIndex.value
}

const fetchSuraDetails = async () => {
  suraDetails.value = await store.getSuraDetails()
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
