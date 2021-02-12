<template>
  <label>
    <v-tabs v-model="tab" background-color="grey lighten-4 mt-n5 pr-1 pl-2" centered>
      <v-tab class="body-1" href="#tab-1">بيان</v-tab>
      <v-tab class="body-1" href="#tab-2">جدول</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-1">
        <div class="webKitWidth">
          <chart
            class="mr-1 pa-0 ml-2 webKitWidth lettersChart"
            :dataType="'letters'"
            :series="series"
            :isLoading="isLoading"
            :options="chartOptions"
            :includeTab="true"
            v-if="showChart"
            :height="getHeight()"
          />
        </div>
      </v-tab-item>
      <v-tab-item value="tab-2">
        <div class="d-flex s">
          <v-card  outlined>
            <tableOccurrences
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
          <dashLabelsPositions
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
import dashLabelsPositions from './dashLabelsPositions.vue'
import chart from './chart.vue'
import chartOptions from '../assets/numbersOfLettersOptions.js'
import tableOccurrences from './tableOccurrences.vue'
import { detailMixin } from '../mixins/detailMixin'

export default {
  name: 'letterDetails',
  components: { dashLabelsPositions, chart, tableOccurrences },
  mixins: [detailMixin],
  data: () => ({
    dataType: 'letters',
    chartOptions: chartOptions,
    tableHeaders: [
      { text: 'الحروف', value: 'x', class: ' lighten-4 black--text' }
    ],
    wordsGroup: null
  }),
  methods: {
    getHeight () {
      var heightDif = this.windowHeight - 240
      return heightDif
    }
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
