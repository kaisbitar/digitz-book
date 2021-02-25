<template>
  <label class="dashVerses d-flex">
    <v-card flat>
      <tableVerses
        :tableData="versesBasics"
        :tableHeaders="tableHeaders"
        :inputText="inputText"
        :isLoading="isLoading"
        :groupBy="null"
        :selectedId="selectedId"
        :dataType="' عن آية أو رقم'"
        :footerProps="footerProps"
        @rowClicked="setVerse"
      />
    </v-card>

    <div class=" pt-12 webKitWidth" outlined>
      <v-tabs class="" v-model="tab" background-color="mt-n5 pr-1 pl-2" centered>
        <v-tab class="dashTabs body-1" href="#tab-1"><span class="caption ml-1">آية</span>{{verseIndex}}</v-tab>
        <v-tab class="dashTabs body-1" href="#tab-2">{{numberOfWords}}<span class="caption mr-1">كلمة </span></v-tab>
        <v-tab class="dashTabs body-1" href="#tab-3">{{numberOfLetters}}<span class="caption mr-1"> حرف </span></v-tab>
        <v-tab class="dashTabs body-1" href="#tab-3" disabled>{{verseNumberToQuran}}<span class="caption"> مصحف </span></v-tab>
      </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-1">
        <dashVersesLabels
          v-if="versesBasics"
          class="ml-2 mb-2"
          :verseIndex="verseIndex"
          :verseNumberToQuran="verseNumberToQuran"
          :numberOfLetters="numberOfLetters"
          :numberOfWords="numberOfWords"
          :verseText="verseText"
          :inputText="inputText"
          :suraName="suraName"
        />
        <div class="d-flex">
          <chart
            class="webKitWidth"
            :isLoading="isLoading"
            :series="verseChart"
            :options="options"
            :height="height"
          />
        </div>
      </v-tab-item>

      <v-tab-item value="tab-2">
        <dashWords
          class="chartRow"
          :numberOfWords="numberOfWords"
          :numberOfLetters="numberOfLetters"
          :indexes="wordIndexes"
          :suraText="verseText"
          :isLoading="isLoading"
        />
      </v-tab-item>
      <v-tab-item value="tab-3">
        <dashLetters
          class="chartRow"
          :numberOfWords="numberOfWords"
          :numberOfLetters="numberOfLetters"
          :suraText="verseText"
          :isLoading="isLoading"
        />
      </v-tab-item>
    </v-tabs-items>
      <v-overlay
        color="white"
        :absolute="true"
        :opacity="0.8"
        :value="isLoading"
      >
      </v-overlay>
    </div>
  </label>
</template>

<script>
import chartOptions from '../assets/frequecyOptions'
import chart from '../components/chart.vue'
import dashWords from './dashWords.vue'
import dashLetters from './dashLetters.vue'
import tableVerses from './tableVerses.vue'
import dashVersesLabels from './dashVersesLabels'
export default {
  name: 'dashVerses',
  props: ['versesBasics', 'isLoading', 'inputText'],
  components: { tableVerses, dashVersesLabels, chart, dashWords, dashLetters },
  data: () => ({
    index: 1,
    tableHeaders: [
      { text: 'السورة', value: 'fileName', class: 'lighten-4 black--text', width: '90', filterable: false },
      { text: 'رقم', value: 'verseIndex', class: 'lighten-4 black--text', width: '69' },
      { text: 'الآية', value: 'verseText', class: 'lighten-4 black--text', width: '245', align: 'center' },
      { text: 'كلمات', value: 'numberOfWords', class: 'lighten-4 black--text' },
      { text: 'حروف', value: 'numberOfLetters', class: 'lighten-4 black--text' }
    ],
    verses: [],
    verseChart: [],
    items: [],
    selectedId: '',
    verseIndex: '',
    verseNumberToQuran: '',
    numberOfLetters: '',
    numberOfWords: '',
    verseText: '',
    suraName: '',
    options: chartOptions,
    footerProps: { 'items-per-page-text': '' },
    windowHeight: window.innerHeight,
    tab: 'tab-1',
    wordIndexes: {}
  }),
  computed: {
    height () {
      var heightDif = this.windowHeight - 385
      return heightDif
    }
  },
  methods: {
    getWordIndexes () {
      this.wordIndexes = {}
      var wordsArr = this.verseText.split(' ')
      wordsArr.map((word, index) => {
        if (!this.wordIndexes[word]) {
          this.wordIndexes[word] = [index + 1]
          return null
        }
        this.wordIndexes[word].push(index + 1)
      })
    },
    setVerse (item) {
      if (!item) {
        item = this.versesBasics[0]
      }
      this.selectedId = item.verseNumberToQuran.toString()
      this.verseIndex = item.verseIndex
      this.verseNumberToQuran = item.verseNumberToQuran
      this.numberOfLetters = item.numberOfLetters
      this.numberOfWords = item.numberOfWords
      this.verseText = item.verseText
      this.suraName = item.fileName.replace(/[0-9]/g, '')
      this.perpareChartData(item)
      this.getWordIndexes()
    },
    perpareChartData (item) {
      var wordsArr = item.verseText.split(' ')
      var chart = []
      wordsArr.map((word, index) => {
        chart[index] = word.length
      })
      this.verseChart = [{ data: chart }]
    },
    setToolTip () {
      var tooltip = {
        custom: (obj) => {
          var wordsArr = this.verseText.split(' ')
          return '<div class= d-flex pt-2 pa-2">' +
                    '<div class=" tipInfo tipInfo2 ">' + wordsArr[obj.dataPointIndex] + '</div>' +
                    '<div class=" tipInfo ">' + obj.series[0][obj.dataPointIndex] + '<span class="tipLabel"> حروف</span></div>' +
                  '</div>'
        },
        shared: true,
        followCursor: true
      }

      this.options = {
        ...this.options,
        ...{ tooltip: tooltip }
      }
    },
    setXaxis () {
      var xaxis = {
        labels: { show: true },
        title: {
          offsetY: -5,
          text: 'تواتر الحروف',
          style: {
            fontSize: '12px'
          }
        },
        axisTicks: {
          show: true,
          maxTicksLimit: 1,
          interval: 1
        },
        tickAmount: 2,
        tickPlacement: 'between'
      }
      this.options = {
        ...this.options,
        ...{ xaxis: xaxis }
      }
    },
    setChart () {
      var chart = {
        offsetY: 10,
        type: 'area',
        toolbar: {
          show: false
        }
      }
      this.options = {
        ...this.options,
        ...{ chart: chart }
      }
    },
    setDataLabels () {
      var dataLabels = {
        enabled: true,
        offsetY: 0,
        background: {
          enabled: false
        }
      }
      this.options = {
        ...this.options,
        ...{ dataLabels: dataLabels }
      }
    },
    setNoResults () {
      this.wordIndexes = []
      this.verseIndex = 0
      this.verseNumberToQuran = 0
      this.numberOfLetters = 0
      this.numberOfWords = 0
      this.verseText = ''
      this.verseChart = [{ data: [] }]
    }
  },
  watch: {
    versesBasics () {
      if (this.versesBasics.length === 0 || !this.versesBasics) {
        this.setNoResults()
        return
      }
      this.setVerse()
      this.setToolTip()
      this.setChart()
      // this.setDataLabels()
      this.setXaxis()
    }
  },
  created () {
  },
  mounted () {
    if (this.versesBasics.length === 0 || !this.versesBasics) {
      this.setNoResults()
      return
    }
    this.setVerse()
    this.setToolTip()
    // this.setDataLabels()
    this.setChart()
    this.setXaxis()
    this.getWordIndexes()
  }
}
</script>

<style>
tr.v-data-table__selected {
  background: #7d92f5 !important;
}
.dashTabs{
  height: 35px;
}
.v-slide-group__content.v-tabs-bar__content {
    height: 35px;
}
</style>
