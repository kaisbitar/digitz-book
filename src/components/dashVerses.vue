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

    <div class=" pt-5 webKitWidth" outlined>
      <v-tabs class="" v-model="tab" background-color="mt-n5 pr-1 pl-2" centered>
        <v-tab class="dashTabs" href="#tab-1"><span class=" ml-1">آية</span>{{verseIndex}}</v-tab>
        <v-tab class="dashTabs" href="#tab-2">{{numberOfWords}}<span class=" mr-1">كلمة </span></v-tab>
        <v-tab class="dashTabs" href="#tab-3">{{numberOfLetters}}<span class=" mr-1"> حرف </span></v-tab>
        <v-tab class="dashTabs" href="#tab-3" disabled>{{verseNumberToQuran}}<span class=""> مصحف </span></v-tab>
      </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-1" class="labelsWrapper">
        <dashVersesLabels
          v-if="versesBasics"
          class="ml-2 mb-2 "
          :verseIndex="verseIndex"
          :verseNumberToQuran="verseNumberToQuran"
          :numberOfLetters="numberOfLetters"
          :numberOfWords="numberOfWords"
          :verseText="verseText"
          :inputText="inputText"
          :secondInput="secondInput"
          :suraName="suraName"
        />
        <div class="d-flex">
          <glChart
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
          :includeTab="true"
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
import glChart from '../components/glChart.vue'
import dashWords from './dashWords.vue'
import dashLetters from './dashLetters.vue'
import tableVerses from './tableVerses.vue'
import dashVersesLabels from './dashVersesLabels'
export default {
  name: 'dashVerses',
  props: ['versesBasics', 'isLoading', 'inputText'],
  components: { tableVerses, dashVersesLabels, glChart, dashWords, dashLetters },
  data: () => ({
    index: 1,
    tableHeaders: [
      { text: 'السورة', value: 'fileName', class: 'lighten-4 black--text', width: '90', sortable: false },
      { text: 'رقم', value: 'verseIndex', class: 'lighten-4 black--text', width: '69' },
      { text: 'الآية', value: 'verseText', class: 'lighten-4 black--text', width: '274', align: 'center' },
      { text: 'كلمات', value: 'numberOfWords', class: 'lighten-4 black--text' },
      { text: 'حروف', value: 'numberOfLetters', class: 'lighten-4 black--text' },
      { text: 'مصحف', value: 'verseNumberToQuran', class: 'lighten-4 black--text' }
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
    wordIndexes: {},
    secondInput: ''
  }),
  computed: {
    height () {
      var heightDif = this.windowHeight - 385
      return heightDif
    },
    targetFileName () {
      if (!this.$store.getters.target) return
      return this.$store.getters.target.fileName
    },
    targetVerseIndex () {
      if (!this.$store.getters.target) return
      return this.$store.getters.target.verseIndex
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
      this.numberOfLetters = item.verseText.replace(/ /g, '').length.toString()
      this.numberOfWords = item.verseText.split(' ').length.toString()
      this.verseText = item.verseText
      this.suraName = item.fileName.replace(/[0-9]/g, '')
      this.perpareChartData(item)
      this.getWordIndexes()
      this.setTarget(item)
    },
    setOnLoadVerseId () {
      // this.selectedId = 298
      // var item = this.versesBasics.filter((item) => {
      //   if (item.verseNumberToQuran === this.selectedId) { return item }
      // })
      // console.log(item)
    },
    setTarget (item) {
      this.suraName = item.fileName.replace(/[0-9]/g, '')
      this.suraNumber = item.fileName.replace(/[ء-٩]/g, '').replace(/\s/g, '')
      var fileName = this.suraNumber + this.suraName
      var target = { fileName: fileName, verseIndex: item.verseIndex }
      this.$store.commit('setTarget', target)
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
          offsetY: 0,
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
        tickAmount: 1,
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
        },
        events: {
          mouseMove: (event, chartContext, config) => {
            var arr = this.verseText.split(' ')
            this.secondInput = arr[config.dataPointIndex]
          }
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
      this.setOnLoadVerseId()
      this.setVerse()
      this.setToolTip()
      this.setChart()
      this.setDataLabels()
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
    this.setOnLoadVerseId()
    this.setToolTip()
    this.setDataLabels()
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
  letter-spacing: 0px;;
}
.v-slide-group__content.v-tabs-bar__content {
    height: 35px;
}
.labelsWrapper{
  /* max-height: 333px;
  overflow-y: scroll; */
}
</style>
