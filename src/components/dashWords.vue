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
import chartOptions from '../assets/numbersOfLettersOptions.js'

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
      this.embedOptions()
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
      this.options.dataLabels = {
        formatter: function (val, opt) {
          return opt.w.globals.seriesX[0][opt.dataPointIndex]
        },
        background: {
          enabled: true,
          foreColor: '#fff',
          padding: 4,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: '#616161'
        },
        offsetY: -10
      }
      // this.options.tooltip = {
      //   y: {
      //     title: {
      //       formatter: () => {
      //         return null
      //       }
      //     },
      //     formatter: () => {
      //       return this.detailElement
      //     }
      //   },
      //   x: {
      //     formatter: (val) => {
      //       return 'الموقع: ' + val
      //     }
      //   },
      //   style: {
      //     fontSize: '16px',
      //     fontFamily: '"Tajwal", sans-serif !important'
      //   }
      // }
      this.seriesC = [{ data: points }]
    },
    getHeight () {
      var heightDif = this.windowHeight - 270
      return heightDif
    },
    embedOptions () {
      this.options = {
        theme: {
          palette: 'palette3',
          monochrome: {
            enabled: true,
            color: '#616161'
          }
        },
        xaxis: {
          title: {
            offsetY: 13,
            text: 'المواقع'
          },
          max: this.numberOfWords,
          min: 1
        },
        yaxis: {
          show: false
        },
        chart: {
          offsetY: -10,
          type: 'scatter',
          toolbar: {
            show: false
          }
        },
        markers: {
          offsetY: 0,
          size: 5,
          shape: 'circle',
          hover: {
            size: 7
          }
        },
        tooltip: {
          y: {
            title: {
              formatter: () => {
                return null
              }
            },
            formatter: () => {
              return this.detailElement
            }
          },
          x: {
            formatter: (val) => {
              return 'الموقع: ' + val
            }
          },
          style: {
            fontSize: '16px',
            fontFamily: '"Tajwal", sans-serif !important'
          }
        }
      }
    }
  },
  computed: {},

  watch: {
    indexes () {
      // setTimeout(() => {
      if (!this.indexes) return
      this.embedOptions()
      this.highlightOnChart(this.indexes[this.occurrences[0].x], 0)
      // }, 3000)
    }
  },
  mounted () {
    if (!this.indexes) return
    this.embedOptions()
    this.highlightOnChart(this.indexes[this.occurrences[0].x], 0)
  }
}
</script>

<style>
.webKitWidth {
  width: -webkit-fill-available;
}
.tableStyle {
  width: 270px;
}
.searchField {
  width: 150px;
}
.tableStyle td {
  border: none !important;
}
.tableStyle table {
  border-collapse: collapse;
  width: 100%;
}
.tableStyle tr:nth-child(even) {
  background-color: #fdfdfd;
}
.tableStyle td {
  border: none !important;
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
