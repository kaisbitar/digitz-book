<template>
  <label>
    <v-tabs v-model="tab" background-color="grey lighten-4 mt-n5 pr-1 pl-2" centered>
      <v-tab class="body-1" href="#tab-1">بيان</v-tab>
      <v-tab class="body-1" href="#tab-2">جدول</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-1">
        <div class="webKitWidth">
          <div class="showIcon">
            <v-icon :color="showChart === true ? 'grey' : 'blue'" small
              >mdi-table-headers-eye</v-icon
            >
          </div>
          <chart
            class="mr-1 pa-0 ml-2 webKitWidth lettersChart"
            :dataType="'letters'"
            :series="series"
            :isLoading="isLoading"
            :options="chartOptions"
            :includeTab="true"
            v-if="showChart"
          />
        </div>
      </v-tab-item>
      <v-tab-item value="tab-2">
        <div class="d-flex s">
          <v-card  outlined>
            <occTable
              :tableData="occurrences"
              :dataType="dataType"
              :tableHeaders="tableHeaders"
              :search="search"
              :footerProps="footerProps"
              :isLoading="isLoading"
              :groupBy="null"
              :selectedId="selectedId"
              @rowClicked="setDetailItem"
            />
          </v-card>
          <dashboardPositions
            :detailElement="detailElement"
            :detailCount="detailCount"
            :detailsData="indexes"
            :isLoading="isLoading"
          />
        </div>
      </v-tab-item>
    </v-tabs-items>
  </label>
</template>

<script>
import dashboardPositions from './dashboardPositions.vue'
import chart from './chart.vue'
import chartOptions from '../assets/numbersOfLettersOptions.js'
import OccTable from './occTable.vue'

export default {
  name: 'letterDetails',
  components: { dashboardPositions, chart, OccTable },
  props: ['indexes', 'occurrences', 'isLoading'],
  data: () => ({
    dataType: 'letters',
    detailElement: '',
    detailCount: 0,
    search: '',
    footerProps: { 'items-per-page-text': '' },
    selectedId: 0,
    chartOptions: chartOptions,
    tableHeaders: [
      { text: 'الحروف', value: 'x', class: ' lighten-4 black--text' }
      // { text: 'تكرار', value: 'y', class: ' lighten-4 black--text' }
    ],
    wordsGroup: null,
    showChart: true,
    windowHeight: window.innerHeight,
    groupBy: 'y',
    tab: null
  }),
  computed: {
    fileName () {
      return this.$store.getters.target.fileName
    },
    series () {
      if (!this.occurrences) return
      return [{ data: this.occurrences }]
    }
  },
  methods: {
    setDetailItem (index, item) {
      this.selectedId = item.x

      this.detailElement = item.x
      this.detailCount = item.y
    },
    setInitialItem () {
      this.selectedId = this.occurrences[0].x
      this.detailElement = this.occurrences[0].x
      this.detailCount = this.occurrences[0].y
    }
  },
  watch: {
    indexes () {
      if (!this.occurrences) return null
      this.setInitialItem(0)
    }
  },
  created () {

  },
  mounted () {
    if (!this.occurrences) return null
    this.setInitialItem(0)
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
.showIcon {
  position: absolute;
  z-index: 2;
  margin-right: 16px;
  margin-top: 24px;
  cursor: pointer;
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
