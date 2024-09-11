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

<script>
import chartOptions from '../assets/wordChartOptions.js'
import tableOccurrences from './tableOccurrences.vue'
import { detailMixin } from '../mixins/detailMixin'
import dashLabels from './dashLabels.vue'
import appChart from './appChart.vue'

export default {
  name: 'dashWords',
  mixins: [detailMixin],
  props: ['indexes', 'numberOfWords'],
  components: {
    tableOccurrences,
    dashLabels,
    appChart
  },
  data: () => ({
    tableHeaders: [
      { text: 'كلمة', value: 'x', class: 'brown lighten-5 black--text' },
      { text: 'تكرار', value: 'y', class: 'brown lighten-5 black--text' }
    ],
    options: chartOptions,
    dataType: 'words',
    wordsGroup: null,
    series: []
  }),
  methods: {
    rowClickedActions (index, item) {
      this.setDetailItem(this.indexes[this.detailElement], item)
      this.setDataLabel(this.indexes[this.detailElement])
      this.createSeries(this.indexes[this.detailElement], 0)
    },
    createSeries (positions, occurrence) {
      var points = []
      for (var i = 0; i < positions.length; i++) {
        points.push({
          x: positions[i],
          y: occurrence
        })
      }
      this.series = [{ data: points }]
    },
    setXaxis () {
      if (!this.indexes) return
      var xaxis = {}
      xaxis.min = 1
      xaxis.max = parseInt(this.numberOfWords)
      this.options = {
        ...this.options,
        ...{ xaxis: xaxis }
      }
    },
    setDataLabel (positions) {
      if (!this.indexes) return
      var x = {
        formatter: function (val, opt) {
          return positions[opt.dataPointIndex]
        }
      }

      this.options = {
        ...this.options,
        ...{ dataLabels: x }
      }
    },
    setToolTip () {
      var x = {
        custom: (obj) => {
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
        followCursor: true
      }
      this.options = {
        ...this.options,
        ...{ tooltip: x }
      }
    },
    countRepeatedWords (sentence) {
      const words = sentence.split(' ')
      const wordMap = {}

      for (let i = 0; i < words.length; i++) {
        const currentWordCount = wordMap[words[i]]
        const count = currentWordCount || 0
        wordMap[words[i]] = count + 1
      }
      return wordMap
    }
  },
  computed: {
    occurrences () {
      var repeatedWords = this.countRepeatedWords(this.suraText)
      var occ = []
      for (const [key, value] of Object.entries(repeatedWords)) {
        occ.push({ x: key, y: value })
      }
      return occ
    }
  },
  watch: {
    indexes () {
      if (!this.indexes) return
      this.setXaxis()
      this.setToolTip()
      this.createSeries(this.indexes[this.occurrences[0].x], 0)
    }
  },
  mounted () {
    if (!this.indexes) return
    this.setXaxis()
    this.setToolTip()
    this.setInitialItem()
    this.setDataLabel(this.indexes[this.detailElement])
    this.createSeries(this.indexes[this.detailElement], 0)
  },
  created () {}
}
</script>

<style>
.appSearchBox {
  margin-bottom: -21px;
}
.wordsChart text {
  text-anchor: start;
}
</style>
