<template>
  <label>
    <div class="d-flex" :style="getHeight()">
      <v-card v-if="!showChart" outlined>
        <occTable
        :tableData="occurrences"
        :dataType="dataType"
        :tableHeaders="tableHeaders"
        :footerProps="footerProps"
        :isLoading="isLoading"
        :groupBy="groupBy"
        :selectedId="selectedId"
        @rowClicked="setDetailItem"
        />
      </v-card>
      <dashboardPositions
        v-if="!showChart"
        :detailElement="detailElement"
        :detailCount="detailCount"
        :detailsData="indexes"
        :isLoading="isLoading"
      />
    </div>
  </label>
</template>

<script>
import dashboardPositions from './dashboardPositions.vue'
// import chart from './chart.vue'
import chartOptions from '../assets/numbersOfWordsOptions.js'
import OccTable from './occTable.vue'

export default {
  name: 'letterDetails',
  components: {
    dashboardPositions,
    // chart,
    OccTable
  },
  props: [
    'indexes',
    'occurrences',
    'isLoading'
  ],
  data: () => ({
    dataType: 'words',
    detailElement: '',
    detailCount: 0,
    footerProps: { 'items-per-page-text': '' },
    selectedId: '',
    chartOptions: chartOptions,
    tableHeaders: [
      { text: 'كلمة', value: 'x', class: ' lighten-4 black--text' }
      // { value: 'y', class: ' lighten-4 black--text' }
    ],
    wordsGroup: null,
    showChart: false,
    windowHeight: window.innerHeight,
    groupBy: 'y'
  }),
  computed: {
    fileName () {
      return this.$store.getters.target.fileName
    },
    series () {
      return [{ data: this.occurrences }]
    },
    seriesB () {
      var result = []
      for (var i = 0; i < this.occurrences.length; i++) {
        var word = this.occurrences[i].x
        for (var j = 0; j < this.indexes[word].length; j++) {
          var obj = {}
          obj.y = this.occurrences[i].y
          obj.x = this.indexes[word][j]
          result.push(obj)
        }
      }

      return [{ data: result }]
    }
  },
  methods: {
    setDetailItem (index, item) {
      this.selectedId = item.x
      this.detailElement = item.x
      this.detailCount = item.y
    },
    setInitialItem () {
      this.selectedId = 0
      this.detailElement = this.occurrences[0].x
      this.detailCount = this.occurrences[0].y
    },
    getHeight () {
      var heightDif = this.windowHeight - 155
      return 'height:' + heightDif + 'px'
    }
  },
  watch: {
    indexes () {
      if (!this.occurrences) return
      this.setInitialItem(0)
    }
  },
  created () {
    if (!this.occurrences) return
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
/* .absoluteBtn {
  position: absolute;
  z-index: 2;
  margin-right: 16px;
  margin-top: 24px;
} */
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
