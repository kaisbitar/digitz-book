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
          :isLoading="isLoading"
          :series="verseChart"
          :options="options"
          :height="getHeight()"
        />
        <chart
          :isLoading="isLoading"
          :series="verseChart"
          :options="options"
          :height="getHeight()"
        />
      </div>
      <v-overlay
        color="white"
        :absolute="true"
        :opacity="0.8"
        :value="isLoading"
      >
      </v-overlay>
      <!--
      <v-card outlined class="pa-2 mb-2">
        {{ versesBasics[1].wordOccurrences }} wordOccurrences
      </v-card> -->
    </v-card>
  </label>
</template>

<script>
import chartOptions from '../assets/suraDashbordChartOptions.js'
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
  computed: {},
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
      this.options.chart = { type: 'bar', toolbar: { show: false } }
      this.options.xaxis = { tickAmount: 1 }
      this.verseChart = [{ data: chart }]
    },
    getHeight () {
      var heightDif = this.windowHeight - 450
      return heightDif
    }
  },
  watch: {
    versesBasics () {
      this.setVerse()
    }
  },
  created () {},
  mounted () {
    if (this.versesBasics.length === 0) return null
    this.setVerse()
  }
}
</script>

<style>
.dashVersesLabels {
  /* width: 360px; */
}
.letterOccurrences {
  /* width: 200px; */
}
.letterIndexes {
}
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
