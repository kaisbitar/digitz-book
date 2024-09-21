<template>
  <SuraToolBar :title="fileName" :tabs="tabs" />
  <SuraText
    v-if="activeTab === 'suraText'"
    :suraTextArray="suraTextWithTashkeel"
    :isLoading="isLoading"
    :inputText="inputText"
  />
  <Verses
    v-if="activeTab === 'versesTab'"
    :versesBasics="versesBasics"
    :isLoading="isLoading"
    @verseSelected="handleVerseSelected"
    class="webKitWidth"
  />
  <DashFrequency
    v-if="activeTab === 'frequency'"
    :chartFreqSeries="chartFreqSeries"
    :chartOptions="chartOptions"
    :versesText="suraTextArray"
    :isLoading="isLoading"
    :height="chartWindowHeight"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuranStore } from '@/stores/app'
import chartOptionsConfig from '@/assets/frequecyOptions'
import { useMixin } from '../mixins/mixins'

const props = defineProps(["inputText", "verseSelected"]);
const { setTargetFromArrow } = useMixin()
const store = useQuranStore()

const chartOptions = ref(chartOptionsConfig)
const suraTextWithTashkeel = ref([])
const numberOfLetters = ref(null)
const numberOfVerses = ref(null)
const numberOfWords = ref(null)
const startIndex = ref(null)
const endIndex = ref(null)
const suraTextArray = ref([])
const versesBasics = ref([])
const isLoading = ref(false)
const letterSeries = ref([{ data: [] }])
const versesSeries = ref([{ data: [] }])
const wordsSeries = ref([{ data: [] }])
const details = ref({})

const tabs = computed(() => [
  { title: 'نص', name: 'suraText' },
  { title: 'آية', value: numberOfVerses.value, name: 'versesTab' },
  { title: 'كلمة', value: numberOfWords.value, name: 'wordsTab' },
  { title: 'حرف', value: numberOfLetters.value, name: 'lettersTab' },
  { title: 'تواتر', name: 'frequency' },
])
const chartWindowHeight = computed(() => window.innerHeight - 260)
const fileName = computed(() => store.getTarget?.fileName || '001الفاتحة')
const suraNumber = computed(() => parseInt(fileName.value.replace(/^\D+/g, '')))
const tableQuranIndex = computed(() => store.getTableQuranIndex)
const suraBasics = computed(
  () => tableQuranIndex.value[suraNumber.value] || tableQuranIndex.value[1],
)
const chartFreqType = computed(() => store.getChartFreqType)
const chartFreqSeries = computed(() =>
  chartFreqType.value === 'words' ? wordsSeries.value : letterSeries.value,
)
const oneQuranFile = computed(() => store.getOneQuranFile)
const allVersesWithTashkeel = computed(() => store.getAllVersesWithTashkeel)

const tooltipLabel = computed(() => {
  return chartFreqType.value === 'words' ? 'كلمات' : 'حرف'
})

const tooltipLabel2 = computed(() => {
  return fileName.value !== '000المصحف' ? 'آية' : 'سورة'
})

const activeTab = computed({
  get: () => store.getActiveSuraTab,
  set: value => store.setActiveSuraTab(value),
})

const handleVerseSelected = (verse) => {
  store.setActiveSuraTab("suraText");
}

const setSuraBasics = () => {
  numberOfLetters.value = suraBasics.value.numberOfLetters
  numberOfVerses.value = suraBasics.value.numberOfVerses
  numberOfWords.value = suraBasics.value.numberOfWords
  startIndex.value = suraBasics.value.verseNumberToQuran - 1
  endIndex.value = suraBasics.value.numberOfVerses + startIndex.value
}

const fetchSuraDetails = async () => {
  isLoading.value = true
  details.value = await store.getSuraDetails()
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
  store.setActiveRoute('sura')
  prepareData()
})
</script>

<style lang="scss">
#suraBlock {
  margin: 0;
  overflow-y: scroll;
  margin-top: 10px;
}
</style>
