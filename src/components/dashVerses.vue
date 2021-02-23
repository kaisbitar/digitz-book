<template>
  <label class="dashVerses d-flex">
    <v-card outlined>
      <tableVerses
        :tableData="versesBasics"
        :tableHeaders="tableHeaders"
        :isLoading="isLoading"
        :groupBy="null"
        :selectedId="selectedId"
        :dataType="' عن آية'"
        :footerProps="footerProps"
        @rowClicked="setVerse"
      />
    </v-card>

    <div class=" pt-5 webKitWidth" outlined>
      <v-tabs v-model="tab" background-color="grey lighten-4 mt-n5 pr-1 pl-2" centered>
        <v-tab class="body-1" href="#tab-1"><span class="caption ml-1">آية</span>{{verseIndex}}</v-tab>
        <v-tab class="body-1" href="#tab-2">{{numberOfWords}}<span class="caption mr-1">كلمة </span></v-tab>
        <v-tab class="body-1" href="#tab-3">{{numberOfLetters}}<span class="caption mr-1"> حرف </span></v-tab>
        <v-tab class="body-1" href="#tab-3" disabled>{{verseNumberToQuran}}<span class="caption"> مصحف </span></v-tab>
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
  props: ['versesBasics', 'isLoading'],
  components: { tableVerses, dashVersesLabels, chart, dashWords, dashLetters },
  data: () => ({
    index: 1,
    tableHeaders: [
      { text: 'رقم', class: 'lighten-4 black--text', width: '69' },
      { text: 'الآية', class: 'lighten-4 black--text', width: '200' },
      { text: 'السورة', class: 'lighten-4 black--text', width: '110' },
      { text: 'كلمات', class: 'lighten-4 black--text' },
      { text: 'حروف', class: 'lighten-4 black--text' }
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
    options: chartOptions,
    footerProps: { 'items-per-page-text': '' },
    windowHeight: window.innerHeight,
    tab: 'tab-1',
    wordIndexes: {}
  }),
  computed: {
    height () {
      var heightDif = this.windowHeight - 350
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
      this.selectedId = item.verseIndex.toString()
      this.verseIndex = item.verseIndex
      this.verseNumberToQuran = item.verseNumberToQuran
      this.numberOfLetters = item.numberOfLetters
      this.numberOfWords = item.numberOfWords
      this.verseText = item.verseText
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
                    '<div class=" tipInfo ">' + obj.series[0][obj.dataPointIndex] + ' حروف</div>' +
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
    }
  },
  watch: {
    versesBasics () {
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
    if (this.versesBasics.length === 0) return null
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
</style>
 indexSura (verses) {
      verses = verses.map((items, index) => ({
        ...items
      }))
      this.verses = verses
    },
    prepareTableData () {
      var verses = this.versesMap
      verses = Object.entries(this.versesMap)
      verses = verses.map((post) => {
        return post[1]
      })
      this.indexSura(verses)
    }
