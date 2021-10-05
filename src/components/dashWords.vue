<template>
  <div>
    <div class="mt-5">
      <dashLabels
        class="dashLabelsWrap"
        :detailElement="detailElement"
        :detailCount="detailCount"
        :isLoading="isLoading"
        :showPosition="false"
      />
      <glChart
        class="wordsChart"
        :dataType="'words'"
        :series="seriesC"
        :isLoading="isLoading"
        :options="options"
        :height="100"
      />
      <h5 class="text-center mt-n6">المواقع</h5>
    </div>
    <div class="d-flex">
      <tableOccurrences
        class="wordsTable"
        :tableData="occurrences"
        :dataType="'كلمة'"
        :tableHeaders="tableHeaders"
        :footerProps="footerProps"
        :isLoading="isLoading"
        :groupBy="groupBy"
        @rowClicked="rowClickedActions"
        :detailElement="detailElement"
        :includeTab="includeTab"
      />
      <!-- <p>مواقع {{detailElement}} في {{fileName.replace(/[0-9]/g, '')}}</p> -->
    </div>
  </div>
</template>

<script>
import dashLabels from './dashLabels.vue'
import tableOccurrences from './tableOccurrences.vue'
import glChart from './glChart.vue'
import { detailMixin } from '../mixins/detailMixin'
import chartOptions from '../assets/wordChartOptions.js'

export default {
  name: 'dashWords',
  mixins: [detailMixin],
  props: ['indexes', 'numberOfWords'],
  components: {
    dashLabels,
    tableOccurrences,
    glChart
  },
  data: () => ({
    dataType: 'words',
    options: chartOptions,
    tableHeaders: [{ text: '', value: 'x', class: ' lighten-4 black--text' }],
    wordsGroup: null,
    seriesC: []
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
      this.seriesC = [{ data: points }]
    },
    setXaxis () {
      if (!this.indexes) return
      var xaxis = {}
      xaxis.min = 1
      xaxis.max = parseInt(this.numberOfWords)
      // xaxis.offsetX = -9
      // xaxis.axisTicks = { show: true }
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
.webKitWidth {
  width: -webkit-fill-available;
}
.table {
  /* max-width: 268px; */
}

.wordsTable  {
  /* margin-top: 13px; */
}
.wordsTable thead.v-data-table-header {
    display: none;
}
.glSearchBox {
  margin-bottom: -21px;
}
.wordsChart text{
text-anchor: start;
}
</style>