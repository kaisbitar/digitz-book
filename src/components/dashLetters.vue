<template>
  <div>
    <v-tabs v-model="tab" background-color="mt-0 pr-1 pl-2" centered>
      <v-tab class="dashTabs" href="#tab-1">بيان</v-tab>
      <v-tab class="dashTabs" href="#tab-2">جدول</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-1">
        <div class="webKitWidth">
          <appChart
            class="mr-1 pa-0 ml-2 webKitWidth lettersChart"
            :dataType="'letters'"
            :series="series"
            :isLoading="isLoading"
            :options="options"
            :includeTab="true"
            v-if="showChart"
            :height="getHeight()"
          />
        </div>
      </v-tab-item>
      <v-tab-item value="tab-2">
        <div class="d-flex s">
          <v-card outlined>
            <tableOccurrences
              :tableData="occurrences"
              :dataType="dataType"
              :tableHeaders="tableHeaders"
              :search="search"
              :footerProps="footerProps"
              :isLoading="isLoading"
              :groupBy="null"
              :includeTab="true"
              @rowClicked="setDetailItem"
            />
          </v-card>
          <dashLabelsPositions
            :detailElement="detailElement"
            :detailCount="detailCount"
            :detailsData="indexes"
            :isLoading="isLoading"
          />
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import dashLabelsPositions from './dashLabelsPositions.vue'
import appChart from './appChart.vue'
import chartOptions from '../assets/numbersOptions.js'
import tableOccurrences from './tableOccurrences.vue'
import { detailMixin } from '../mixins/detailMixin'

export default {
  name: 'letterDetails',
  components: { dashLabelsPositions, appChart, tableOccurrences },
  mixins: [detailMixin],
  data: () => ({
    dataType: 'letters',
    options: chartOptions,
    tableHeaders: [
      { text: 'الحروف', value: 'x', class: ' lighten-4 black--text' }
    ],
    indexes: {},
    wordsGroup: null,
    alfhaBet: [
      'ب',
      'ت',
      'ث',
      'ج',
      'ح',
      'خ',
      'د',
      'ذ',
      'ر',
      'ز',
      'س',
      'ش',
      'ص',
      'ض',
      'ط',
      'ظ',
      'ع',
      'غ',
      'ف',
      'ق',
      'ك',
      'ل',
      'م',
      'ن',
      'ه',
      'و',
      'ي',
      'ؤ',
      'ء',
      'ى',
      'ة',
      'أ',
      'آ',
      'إ',
      'ا'
    ],
    occurrences: []
  }),
  methods: {
    setToolTip () {
      var x = {
        custom: (obj) => {
          return (
            '<div class="d-flex pt-2 pa-2">' +
            '<div class=" tipInfo "><span class="tipLabel">الحرف:</span> ' +
            obj.w.globals.seriesX[0][obj.dataPointIndex] +
            '</div>' +
            '<div class="  tipInfo tipInfo2"><span class="tipLabel">تكرار:</span> ' +
            obj.series[0][obj.dataPointIndex] +
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
    getHeight () {
      var heightDif = this.windowHeight - 290
      return heightDif
    },
    getIndexes () {
      var obj = {}
      var indexes = this.alfhaBet.map((letter) => {
        for (var i = 0; i < this.suraText.length; i++) {
          if (!obj[letter]) {
            obj[letter] = []
          }
          if (this.suraText[i] === letter) {
            obj[letter].push(i + 1)
          }
        }
        return obj
      })
      this.indexes = indexes[0]
    },
    getOccurrences () {
      this.occurrences = []
      for (const [key, value] of Object.entries(this.indexes)) {
        this.occurrences.push({ x: key, y: value.length })
      }
      this.occurrences.sort((a, b) => (a.y > b.y ? 1 : -1))
    }
  },
  computed: {
    series () {
      if (!this.occurrences) return
      return [{ data: this.occurrences }]
    }
  },
  watch: {
    suraText () {
      if (!this.suraText) return
      this.getIndexes()
      this.getOccurrences()
    }
  },
  created () {
    this.setToolTip()
    this.getIndexes()
    this.getOccurrences()
  }
}
</script>

<style>
.showIcon {
  position: absolute;
  z-index: 2;
  margin-right: 16px;
  margin-top: 24px;
  cursor: pointer;
}
/* .tableStyle .tableItem.text-right {
  background: #f2f2f233;
}
.tableStyle .tableItem.text-right {
  background: #f2f2f233;
} */
.dashSearchField {
  width: 150px;
  margin-bottom: -22px;
  z-index: 3;
  position: relative;
  padding-left: 0px !important;
}

</style>
