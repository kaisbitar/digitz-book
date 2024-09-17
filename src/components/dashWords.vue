<template>
  <div class="d-flex">
    <tableOccurrences
      class="wordsTable"
      :dataType="'كلمة'"
      @rowClicked="rowClickedActions"
      :detailElement="detailElement"
      :tableHeaders="tableHeaders"
      :footerProps="footerProps"
      :tableData="occurrences"
      :includeTab="includeTab"
      :isLoading="isLoading"
      :groupBy="groupBy"
    />
    <div class="webKitWidth">
      <appChart
        class="wordsChart"
        :dataType="'words'"
        :isLoading="isLoading"
        :options="options"
        :series="series"
        :height="100"
      />
      <dashLabels
        class="dashLabelsWrap"
        :detailElement="detailElement"
        :detailCount="detailCount"
        :isLoading="isLoading"
        :showPosition="false"
      />
      <h5 class="text-center mt-n6">المواقع</h5>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import chartOptions from '../assets/wordChartOptions.js'
import tableOccurrences from './tableOccurrences.vue'
import dashLabels from './dashLabels.vue'
import appChart from './appChart.vue'
import { useDetailMixin } from '../mixins/detailMixin'

const props = defineProps(['indexes', 'numberOfWords'])

const { detailElement, setDetailItem, setInitialItem, suraText } = useDetailMixin()

const tableHeaders = ref([
  { text: 'كلمة', value: 'x', class: 'brown lighten-5 black--text' },
  { text: 'تكرار', value: 'y', class: 'brown lighten-5 black--text' },
])

const options = ref(chartOptions)
const dataType = ref('words')
const wordsGroup = ref(null)
const series = ref([])

const rowClickedActions = (index, item) => {
  setDetailItem(indexes[detailElement], item)
  setDataLabel(indexes[detailElement])
  createSeries(indexes[detailElement], 0)
}

const createSeries = (positions, occurrence) => {
  const points = positions.map((position, index) => ({
    x: position,
    y: occurrence,
  }))
  series.value = [{ data: points }]
}

const setXaxis = () => {
  if (!props.indexes) return
  const xaxis = {
    min: 1,
    max: parseInt(props.numberOfWords),
  }
  options.value = { ...options.value, ...{ xaxis } }
}

const setDataLabel = positions => {
  if (!this.indexes) return
  var x = {
    formatter: function (val, opt) {
      return positions[opt.dataPointIndex]
    },
  }

  this.options = {
    ...this.options,
    ...{ dataLabels: x },
  }
}

const setToolTip = () => {
  var x = {
    custom: obj => {
      return (
        '<div class="d-flex pt-2 pa-2">' +
        '<div class=" tipInfo  tipInfo2 ">' +
        this.detailElement +
        '</div>' +
        '<div class=" tipInfo "><span class="tipLabel">الموقع:</span> ' +
        this.indexes[this.detailElement][obj.dataPointIndex] +
        '</div>' +
        '</div>'
      )
    },
    shared: true,
    followCursor: true,
  }
  this.options = {
    ...this.options,
    ...{ tooltip: x },
  }
}

const countRepeatedWords = sentence => {
  const words = sentence.split(' ')
  const wordMap = {}

  for (let i = 0; i < words.length; i++) {
    const currentWordCount = wordMap[words[i]]
    const count = currentWordCount || 0
    wordMap[words[i]] = count + 1
  }
  return wordMap
}

const occurrences = computed(() => {
  const repeatedWords = countRepeatedWords(suraText.value)
  return Object.entries(repeatedWords).map(([key, value]) => ({ x: key, y: value }))
})
watch(
  () => props.indexes,
  newIndexes => {
    if (!newIndexes) return
    setXaxis()
    setToolTip()
    createSeries(newIndexes[occurrences.value[0].x], 0)
  },
  { deep: true },
)

onMounted(() => {
  if (!props.indexes) return
  setXaxis()
  setToolTip()
  setInitialItem()
  setDataLabel(props.indexes[detailElement.value])
  createSeries(props.indexes[detailElement.value], 0)
})
</script>

<style>
.appSearchBox {
  margin-bottom: -21px;
}
.wordsChart text {
  text-anchor: start;
}
</style>
