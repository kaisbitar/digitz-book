<template>
  <div>
    <div class="webKitWidth">
      <div class="absoluteBtn">
        <v-icon
        v-if="selectedDataType === 'letters'"
          @click="chartView = !chartView"
          :color="chartView === true ? 'grey' : 'blue'"
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
        v-if="chartView"
      />
    </div>

    <div class="d-flex">
      <v-card v-if="!chartView" outlined>
        <v-text-field
          :label="'ابحث ' + selectedDataType"
          v-model="search"
          append-icon="mdi-magnify"
          class="mb-1 mr-10 pa-3 searchField rounded mt-1"
          background-color="grey lighten-5 mb-0"
          single-line
          hide-details
          autofocus
        ></v-text-field>
        <v-data-table
          :items="selectedTableData"
          :headers="tableHeaders"
          :items-per-page="2000"
          :search="search"
          :height="getheight()"
          :footer-props="footerProps"
          :loading="isLoading"
          loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
          class="tableStyle"
          selectable-key="selectedRow"
          fixed-header
          :group-by="wordsGroup"
        >
        <template v-slot:[`group.header`]="{group, toggle}">
          <v-btn @click="toggle()">show</v-btn>
          {{group}}
        </template>

          <template v-slot:item="props">
            <tr
              @click="setDetailItem(props.index, props.item )"
              :class="{ active: props.index === selectedId }"
              class="indexItem"
            >
              <td
                class="text-right"
                v-html="highlight(props.item.x, search)"
              ></td>
              <td class="text-right">{{ props.item.y }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
      <suraDashboardPositions
        v-if="!chartView"
        :suraDetailElement="suraDetailElement"
        :suraDetailCount="suraDetailCount"
        :selectedDetailsData="selectedDetailsData"
      />
    </div>
  </div>
</template>

<script>
import suraDashboardPositions from './suraDashboardPositions.vue'
import { appMixin } from '../mixins/mixins'
import chart from './chart.vue'
import chartOptions from '../assets/numbersOfLettersOptions.js'

export default {
  name: 'suraDashboardDetails',
  components: { suraDashboardPositions, chart },
  mixins: [appMixin],
  props: ['selectedDataType'],
  data: () => ({
    tableData: [],
    isLoading: true,
    selectedTableData: [],
    selectedDetailsData: {},
    suraDetailElement: '',
    suraDetailCount: 0,
    search: '',
    footerProps: { 'items-per-page-text': '' },
    windowHeight: window.innerHeight,
    selectedId: 0,
    series: [],
    chartOptions: chartOptions,
    chartView: true,
    tableHeaders: [
      { text: 'كلمة', value: 'x', class: ' lighten-4 black--text' },
      { text: 'تكرار', value: 'y', class: ' lighten-4 black--text' }
    ],
    wordsGroup: null
  }),
  computed: {
    fileName () {
      return this.$store.getters.target.fileName
    }
  },
  methods: {
    fetchSuraDetails () {
      this.isLoading = true
      setTimeout(() => {
        this.$store
          .dispatch('getSuraDetails')
          .then((items) => {
            this.tableData = items
            return items
          })
          .then((items) => {
            this.setData()
          })
          .then(() => {
            this.setInitialItem(0)
            this.setTableHeader()
            this.isLoading = false
          })
      }, 100)
    },
    setData () {
      if (this.selectedDataType === 'words') {
        this.selectedTableData = this.tableData.wordOccurrences
        this.selectedDetailsData = this.tableData.wordIndexes

        return
      }
      this.selectedTableData = this.tableData.letterOccurrences
      this.selectedDetailsData = this.tableData.letterIndexes
      this.series = [{ data: this.selectedTableData }]
    },
    setTableHeader () {
      if (this.selectedDataType === 'words') {
        this.tableHeaders[0].text = 'الكلمة'
        return
      }
      this.tableHeaders[0].text = 'الحرف'
      this.wordsGroup = null
    },
    setDetailItem (index, item) {
      this.selectedId = index
      this.suraDetailElement = item.x
      this.suraDetailCount = item.y
    },
    setInitialItem () {
      this.selectedId = 0
      this.suraDetailElement = this.selectedTableData[0].x
      this.suraDetailCount = this.selectedTableData[0].y
    },
    getheight () {
      var heightDif = this.windowHeight - 280
      return heightDif
    }
  },
  watch: {
    fileName () {
      this.tableData = []
      this.fetchSuraDetails()
    },
    selectedDataType () {
      this.fetchSuraDetails()
      if (this.selectedDataType === 'words') {
        this.chartView = false
        this.wordsGroup = 'y'
        return
      }
      this.chartView = true
    }
  },
  created () {
    if (this.selectedDataType === 'words') {
      this.chartView = false
      this.wordsGroup = 'y'
    }
  },
  mounted () {
    this.fetchSuraDetails()
  },
  filters: {
    highlightVerse: function (text, search) {
      if (search == null) {
        return text
      } else {
        text = text.toString()
        var qurey = new RegExp(search, 'gi')
        return text.replace(qurey, (match) => {
          return '<span class="orange">' + match + '</span>'
        })
      }
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
