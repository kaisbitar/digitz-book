<template>
  <label>
    <div class="d-flex" >
      <v-card outlined>
        <tableOccurrences
        :tableData="occurrences"
        :dataType="dataType"
        :tableHeaders="tableHeaders"
        :footerProps="footerProps"
        :isLoading="isLoading"
        :groupBy="groupBy"
        :selectedId="selectedId"
        @rowClicked="rowClickedActions"
        :initialWord="detailElement"
        />
      </v-card>
      <div class="webKitWidth">
        <dashLabels
          :detailElement="detailElement"
          :detailCount="detailCount"
          :isLoading="isLoading"
          :showPosition="false"
        />
        <chart
          class="mr-2 pa-0 ml-2 webKitWidth lettersChart"
          :dataType="'letters'"
          :series="seriesC"
          :isLoading="isLoading"
          :options="options"
          :includeTab="true"
          :height="getHeight()/2.5"
        />
      </div>
    </div>
  </label>
</template>

<script>
import dashLabels from './dashLabels.vue'
import tableOccurrences from './tableOccurrences.vue'
import chart from './chart.vue'
import { detailMixin } from '../mixins/detailMixin'
import chartOptions from '../assets/wordChartOptions.js'

export default {
  name: 'wordDetails',
  mixins: [detailMixin],
  props: ['numberOfWords'],
  components: {
    dashLabels,
    tableOccurrences,
    chart
  },
  data: () => ({
    dataType: 'words',
    options: chartOptions,
    tableHeaders: [
      { text: 'كلمة', value: 'x', class: ' lighten-4 black--text' }
    ],
    wordsGroup: null,
    seriesC: []
  }),
  methods: {
    rowClickedActions (index, item) {
      this.setDetailItem(index, item)
      this.highlightOnChart(this.indexes[this.detailElement], 0)
    },
    highlightOnChart (positions, occurrence) {
      var points = []
      for (var i = 0; i < positions.length; i++) {
        points.push(
          {
            x: positions[i],
            y: occurrence
          }
        )
      }
      this.seriesC = [{ data: points }]
    },
    setXaxis () {
      var x = {}
      x.title = {
        offsetY: 9,
        text: 'المواقع',
        style: {
          fontSize: '18px',
          fontFamily: '"Tajawal", sans-serif !important'
        }
      }
      x.max = this.numberOfWords
      x.min = 1
      x.tickAmount = undefined
      x.tickPlacement = 'between'
      this.options = {
        ...this.options,
        ...{ xaxis: x }
      }
    },
    setToolTip () {
      var x = {
        custom: (obj) => {
          return '<div class="d-flex pt-2 pa-2">' +
                    '<div class=" tipInfo  tipInfo2 ">' + this.detailElement + '</div>' +
                    '<div class=" tipInfo ">الموقع: ' + obj.w.globals.seriesX[0][obj.dataPointIndex] + '</div>' +
                  '</div>'
        }
      }
      this.options = {
        ...this.options,
        ...{ tooltip: x }
      }
    },
    getHeight () {
      var heightDif = this.windowHeight - 270
      return heightDif
    }
  },
  computed: {},

  watch: {
    indexes () {
      if (!this.indexes) return
      this.setXaxis()
      this.setToolTip()
      this.highlightOnChart(this.indexes[this.occurrences[0].x], 0)
    }
  },
  mounted () {
    if (!this.indexes) return
    this.highlightOnChart(this.indexes[this.occurrences[0].x], 0)
  },
  created () {
    this.setXaxis()
    this.setToolTip()
  }
}
</script>

<style>
.webKitWidth {
  width: -webkit-fill-available;
}
.table {
  max-width: 268px;
}
.v-select__selection.v-select__selection--comma {
  display: none;
}
.v-input.v-input--hide-details.v-input--is-label-active.v-input--is-dirty.theme--light.v-text-field.v-text-field--is-booted.v-select {
  margin-right: -60px;
}
.v-application--is-rtl .v-data-table--fixed-header .v-data-footer {
  margin-left: 0;
}
</style>
<!--// seriesB () {
//   var result = []
//   for (var i = 0; i < this.occurrences.length; i++) {
//     var word = this.occurrences[i].x
//     for (var j = 0; j < this.indexes[word].length; j++) {
//       var obj = {}
//       obj.y = this.occurrences[i].y
//       obj.word = word
//       obj.x = this.indexes[word][j]
//       result.push(obj)
//     }
//   }
//   return [{ data: result }]
// },
-->
