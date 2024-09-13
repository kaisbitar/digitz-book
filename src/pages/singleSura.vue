<template>
  <div class="compWrapper">
    <div class="d-flex">
      <appTitle @arrowClick="setTargetFromArrow" :title="fileName" />
      <suraTextSearchResults
        v-if="activeView === 'textView'"
        style="max-width: 641px"
        :selectedVerse="suraTargetedVerseIndex"
        :suraTextArray="suraTextArray"
        :inputText="inputText"
      />
    </div>
    <!-- <keep-alive> -->
    <suraText
      v-if="activeView === 'textView'"
      :suraTextArray="suraTextWithTashkeel"
      :suraTargetedVerseIndex="suraTargetedVerseIndex"
      :numberOfLetters="numberOfLetters"
      :numberOfVerses="numberOfVerses"
      :numberOfWords="numberOfWords"
      :inputText="inputText"
      :isLoading="isLoading"
    />
    <dashbord
      v-if="activeView === 'detailView' && details"
      :numberOfLetters="numberOfLetters"
      :wordIndexes="details.wordIndexes"
      :numberOfVerses="numberOfVerses"
      :numberOfWords="numberOfWords"
      :suraTextArray="suraTextArray"
      :chartFreqType="chartFreqType"
      :chartFreqSeries="chartFreqSeries"
      :chartOptions="chartOptions"
      :versesSeries="versesSeries"
      :versesBasics="versesBasics"
      :isLoading="isLoading"
      :inputText="inputText"
      :title="fileName"
    />
    <!-- </keep-alive> -->
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'
import suraTextSearchResults from '@/components/suraTextSearchResults'
import chartOptionsConfig from '@/assets/frequecyOptions'
import suraText from '@/components/suraText'
import dashbord from '@/components/dashbord'
import appTitle from '@/components/appTitle'
import { useMixin } from '../mixins/mixins'

const { setTargetFromArrow } = useMixin()
const quranStore = useQuranStore()
const chartOptions = ref(chartOptionsConfig)
const suraTextWithTashkeel = ref([])
const numberOfLetters = ref(null)
const numberOfVerses = ref(null)
const numberOfWords = ref(null)
const startIndex = ref(null)
const endIndex = ref(null)
const view = ref('detailView')
const suraTextArray = ref([])
const versesBasics = ref([])
const isLoading = ref(false)
const letterSeries = ref([{ data: [] }])
const versesSeries = ref([{ data: [] }])
const wordsSeries = ref([{ data: [] }])
const details = ref({})

const activeView = computed(() => quranStore.getActiveView)
const selectedSearch = computed(() => quranStore.getSelectedSearch)
const selectedSearchIndex = computed(() => quranStore.getSelectedSearchIndex)
const inputText = computed(() => selectedSearch.value?.inputText || null)
const suraTargetedVerseIndex = computed(() => quranStore.getTarget?.verseIndex || 1)
const fileName = computed(() => quranStore.getTarget?.fileName || '001الفاتحة')
const suraNumber = computed(() => parseInt(fileName.value.replace(/^\D+/g, '')))
const tableQuranIndex = computed(() => quranStore.getTableQuranIndex)
const suraBasics = computed(
  () => tableQuranIndex.value[suraNumber.value] || tableQuranIndex.value[1],
)
const chartFreqType = computed(() => quranStore.getChartFreqType)
const chartFreqSeries = computed(() =>
  chartFreqType.value === 'words' ? wordsSeries.value : letterSeries.value,
)
const oneQuranFile = computed(() => quranStore.getOneQuranFile)
const allVersesWithTashkeel = computed(() => quranStore.getAllVersesWithTashkeel)

const tooltipLabel = computed(() => {
  return chartFreqType.value === 'words' ? 'كلمات' : 'حرف'
})

const tooltipLabel2 = computed(() => {
  return fileName.value !== '000المصحف' ? 'آية' : 'سورة'
})

const setSuraBasics = () => {
  numberOfLetters.value = suraBasics.value.numberOfLetters
  numberOfVerses.value = suraBasics.value.numberOfVerses
  numberOfWords.value = suraBasics.value.numberOfWords
  startIndex.value = suraBasics.value.verseNumberToQuran - 1
  endIndex.value = suraBasics.value.numberOfVerses + startIndex.value
}

const fetchSuraDetails = async () => {
  isLoading.value = true
  details.value = await quranStore.getSuraDetails()
  isLoading.value = false
}

const prepareData = () => {
  setSuraBasics()
  fetchSuraDetails()
  if (fileName.value === '000المصحف') {
    perpareMushafData()
    suraTextWithTashkeel.value = allVersesWithTashkeel.value
    setMushafToolTip()
    return
  }
  perpareSuraData()
  prepareSuraWithTashkeel()
  setSuraToolTip(suraTextArray.value)
}

const setMushafToolTip = () => {
  var quranToolTip = tableQuranIndex.value.map(item => {
    return item.fileName.replace(/[0-9]/g, '')
  })
  setSuraToolTip(quranToolTip.shift())
}

const setSuraToolTip = toolTipText => {
  var x = {
    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
      return (
        '<div class="mr-2 ml-2 pt-2">' +
        '<div class="d-flex"><span class="tipInfo"><span class="tipLabel">' +
        tooltipLabel2.value +
        ' </span> ' +
        parseInt(dataPointIndex + 1) +
        '</span>' +
        '<span class="tipInfo tipInfo2">' +
        w.globals.series[0][dataPointIndex] +
        ' <span class="tipLabel">' +
        tooltipLabel.value +
        '</span></span></div>' +
        '<p class="tipInfo tipText pr-1 pl-2">' +
        toolTipText[dataPointIndex] +
        '</p>' +
        '</div>'
      )
    },
    shared: true,
    followCursor: true,
  }
  chartOptions.value = {
    ...chartOptions.value,
    ...{ tooltip: x },
  }
}

const perpareSuraData = () => {
  const letters = []
  const words = []
  versesBasics.value = []
  suraTextArray.value = []
  oneQuranFile.value.forEach((item, index) => {
    if (index <= startIndex.value - 1 || index >= endIndex.value) return
    versesBasics.value.push(buildVerseObject(item))
    suraTextArray.value.push(item.verseText)
    letters.push(item.verseText.replace(/ /g, '').length)
    words.push(item.verseText.split(' ').length)
  })
  letterSeries.value = [{ data: letters }]
  wordsSeries.value = [{ data: words }]
}

const buildVerseObject = item => ({
  fileName: item.fileName,
  verseIndex: item.verseIndex.toString(),
  verseText: item.verseText,
  numberOfWords: item.verseText.split(' ').length.toString(),
  numberOfLetters: item.verseText.replace(/ /g, '').length.toString(),
  verseNumberToQuran: item.verseNumberToQuran.toString(),
})

const perpareMushafData = () => {
  versesBasics.value = oneQuranFile.value.map(item => buildVerseObject(item))
  suraTextArray.value = oneQuranFile.value.map(item => item.verseText)
  letterSeries.value = getMushafSeries('numberOfLetters')
  versesSeries.value = getMushafSeries('numberOfVerses')
  wordsSeries.value = getMushafSeries('numberOfWords')
}

const getMushafSeries = dataType => {
  const arr = tableQuranIndex.value.map(item => item[dataType])
  arr.shift()
  return [{ data: arr }]
}

const prepareSuraWithTashkeel = () => {
  suraTextWithTashkeel.value = allVersesWithTashkeel.value.slice(startIndex.value, endIndex.value)
}

watch(fileName, prepareData)

onMounted(() => {
  prepareData()
})
</script>

<style scoped></style>
