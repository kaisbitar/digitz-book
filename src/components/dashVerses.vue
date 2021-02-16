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
    <v-card class="pa-2 mr-2 webKitWidth" outlined>
      <dashVersesLabels
        v-if="versesBasics"
        class="ml-2 mb-2"
        :verseIndx="verseIndx"
        :bigIndx="bigIndx"
        :numberOfLetters="numberOfLetters"
        :numberOfWords="numberOfWords"
        :verseText="verseText"
      />
      <div class="d-flex">
        <chart
        class="mr-n6"
          :isLoading="isLoading"
          :series="verseChart"
          :options="options"
          :height="height"
        />
        <!-- <chart
          :isLoading="isLoading"
          :series="verseChart"
          :options="options"
          :height="height"
        /> -->
      </div>
      <v-overlay
        color="white"
        :absolute="true"
        :opacity="0.8"
        :value="isLoading"
      >
      </v-overlay>
    </v-card>
  </label>
</template>

<script>
import chartOptions from '../assets/frequecyOptions'
import chart from '../components/chart.vue'

import tableVerses from './tableVerses.vue'
import dashVersesLabels from './dashVersesLabels'
export default {
  name: 'dashVerses',
  props: ['versesBasics', 'isLoading'],
  components: { tableVerses, dashVersesLabels, chart },
  data: () => ({
    tableHeaders: [
      { text: 'رقم', value: 'verseIndx', class: 'lighten-4 black--text' },
      { text: 'الآية', value: 'verseText', class: 'lighten-4 black--text' }
    ],
    verses: [],
    verseChart: [],
    items: [],
    selectedId: '',
    verseIndx: '',
    bigIndx: '',
    numberOfLetters: '',
    numberOfWords: '',
    verseText: '',
    options: chartOptions,
    footerProps: { 'items-per-page-text': '' },
    windowHeight: window.innerHeight
  }),
  computed: {
    height () {
      var heightDif = this.windowHeight - 450
      return heightDif
    }
  },
  methods: {
    setVerse (item) {
      if (!item) {
        item = this.versesBasics[0]
      }
      this.selectedId = item.verseIndx.toString()
      this.verseIndx = item.verseIndx
      this.bigIndx = item.bigIndx
      this.numberOfLetters = item.numberOfLetters
      this.numberOfWords = item.numberOfWords
      this.verseText = item.verseText
      this.perpareChartData(item)
    },
    perpareChartData (item) {
      var wordsArr = item.verseText.split(' ')
      var chart = []
      wordsArr.map((word, index) => {
        chart[index] = word.length
      })
      // this.options.chart = { type: 'area', toolbar: { show: false } }
      // this.options.xaxis = { tickAmount: 1 }
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
        }
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
          text: 'تواتر الكلمات',
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
        offsetY: -3,
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
      this.setDataLabels()
      this.setXaxis()
    }
  },
  created () {},
  mounted () {
    if (this.versesBasics.length === 0) return null
    this.setVerse()
    this.setToolTip()
    this.setDataLabels()
    this.setChart()
    this.setXaxis()
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
