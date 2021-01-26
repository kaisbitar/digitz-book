<template>
  <label>
    <div class="webKitWidth">
      <div class="absoluteBtn">
        <v-icon
          v-if="hasChart"
          @click="showChart = !showChart"
          :color="showChart === true ? 'grey' : 'blue'"
          small
          >mdi-table-headers-eye</v-icon
        >
      </div>
      <!-- this is only for letters -->
      <chart
        class="mr-1 pa-0 ml-2 webKitWidth lettersChart"
        :dataType="'letters'"
        :series="series"
        :isLoading="isLoading"
        :options="chartOptions"
        v-if="showChart && hasChart"
      />
    </div>
    <div class="d-flex s" :style="getHeight()">
      <v-card v-if="!showChart || !hasChart" outlined>
        <occTable
        :tableData="tableData"
        :dataType="dataType"
        :tableHeaders="tableHeaders"
        :search="search"
        :footerProps="footerProps"
        :isLoading="isLoading"
        :groupBy="groupBy"
        :selectedId="selectedId"
        @rowClicked="setDetailItem"
        />
      </v-card>
      <dashboardPositions
        v-if="!showChart || !hasChart"
        :detailElement="detailElement"
        :detailCount="detailCount"
        :detailsData="detailsData"
        :isLoading="isLoading"
      />
    </div>
  </label>
</template>

<script>
import dashboardPositions from './dashboardPositions.vue'
import chart from './chart.vue'
import chartOptions from '../assets/numbersOfLettersOptions.js'
import OccTable from './occTable.vue'

export default {
  name: 'suraDashboardDetails',
  components: { dashboardPositions, chart, OccTable },
  props: [
    'dataType',
    'detailsData',
    'tableData',
    'groupBy',
    'hasChart',
    'series',
    'isLoading'
  ],
  data: () => ({
    detailElement: '',
    detailCount: 0,
    search: '',
    footerProps: { 'items-per-page-text': '' },
    selectedId: 0,
    chartOptions: chartOptions,
    tableHeaders: [
      { text: 'كلمة', value: 'x', class: ' lighten-4 black--text' },
      { text: 'تكرار', value: 'y', class: ' lighten-4 black--text' }
    ],
    wordsGroup: null,
    showChart: true,
    windowHeight: window.innerHeight
  }),
  computed: {
    fileName () {
      return this.$store.getters.target.fileName
    }
  },
  methods: {
    setDetailItem (index, item) {
      this.selectedId = index
      this.detailElement = item.x
      this.detailCount = item.y
    },
    setInitialItem () {
      this.selectedId = 0
      this.detailElement = this.tableData[0].x
      this.detailCount = this.tableData[0].y
      this.tableHeaders[0].text = this.dataType
    },
    getHeight () {
      var heightDif = this.windowHeight - 155
      return 'height:' + heightDif + 'px'
    }
  },
  watch: {
    detailsData () {
      if (!this.tableData) return
      this.setInitialItem(0)
    }
  },
  created () {
    this.showChart = this.hasChart
    if (!this.tableData) return
    this.setInitialItem(0)
  },
  mounted () {

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
.resultBox {
  height: 85px;
}
.absoluteBtn {
  position: absolute;
  z-index: 2;
  margin-right: 16px;
  margin-top: 24px;
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
