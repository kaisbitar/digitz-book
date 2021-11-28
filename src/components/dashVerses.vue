<template>
  <div class="dashVerses d-flex">
    <v-card class="webKitWidth" flat v-show="!showSingleVerse">
      <tableVerses
        :tableData="versesBasics"
        :tableHeaders="tableHeaders"
        :inputText="inputText"
        :menuItems="menuItems"
        :activeTableItemId="targetFileName + targetVerseIndex"
        :isLoading="isLoading"
        :groupBy="null"
        :dataType="' عن آية أو رقم'"
        :footerProps="footerProps"
        @rowClicked="handleVerseSelection"
        @handleClickedMenu="runMenuItem"
        @activateRowItem="goToverseTextView"
      />
    </v-card>
    <tableDialogEdit
        v-if="showEditVerse"
        @close="showEditVerse = false"
        :suraName="suraNumber + suraName"
        :verseIndex="verseIndex"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :verseText="verseText"
        :showEditVerse="showEditVerse"
      />
    <div class="pt-5 webKitWidth" outlined v-if="showSingleVerse">
      <dashSingleVerse
        v-if="showSingleVerse"
        :verseIndex="verseIndex"
        @backBtnClicked="showSingleVerse = !showSingleVerse"
        :verseNumberToQuran="verseNumberToQuran"
        :numberOfLetters="numberOfLetters"
        :numberOfWords="numberOfWords"
        :verseText="verseText"
        :inputText="inputText"
        :secondInput="secondInput"
        :suraName="suraName"
        :isLoading="isLoading"
        :verseChart="verseChart"
        :options="options"
        :height="singleVerseHeight"
        :wordIndexes="wordIndexes"
      />
      <v-overlay
        color="white"
        :absolute="true"
        :opacity="0.8"
        :value="isLoading"
      >
      </v-overlay>
    </div>
  </div>
</template>

<script>
import chartOptions from '../assets/frequecyOptions'
import tableVerses from './tableVerses.vue'
import dashSingleVerse from './dashSingleVerse'
import tableDialogEdit from './tableDialogEdit.vue'

export default {
  name: 'dashVerses',
  props: ['versesBasics', 'isLoading', 'inputText'],
  components: { tableVerses, tableDialogEdit, dashSingleVerse },
  data: () => ({
    index: 1,
    tableHeaders: [
      { text: 'INDEX', value: '', class: 'brown lighten-5 black--text', width: '100' },
      { text: 'السورة', value: 'fileName', class: 'brown lighten-5 black--text', width: '110', filterable: false },
      { text: 'رقم', value: 'verseIndex', class: 'brown lighten-5 black--text', width: '80' },
      { text: 'الآية', value: 'verseText', class: 'brown lighten-5 black--text' },
      { text: 'كلمات', value: 'numberOfWords', class: 'brown lighten-5 black--text', width: '85' },
      { text: 'حروف', value: 'numberOfLetters', class: 'brown lighten-5 black--text', width: '85' },
      { text: 'مصحف', value: 'verseNumberToQuran', class: 'brown lighten-5 black--text', width: '90' }
    ],
    menuItems: [
      { title: 'تفصيل ', instuction: 'showSingleVerse' },
      { title: 'تحرير ', instuction: 'showEditVerse' },
      { title: 'إلغاء', instuction: 'cancel' }
    ],
    footerProps: { 'items-per-page-text': '', 'disable-items-per-page': true },
    verseChart: [],
    verseIndex: '',
    verseNumberToQuran: '',
    numberOfLetters: '',
    numberOfWords: '',
    verseText: '',
    suraName: '',
    options: chartOptions,
    windowHeight: window.innerHeight,
    wordIndexes: {},
    secondInput: '',
    showEditVerse: false,
    showSingleVerse: false
  }),
  computed: {
    singleVerseHeight () {
      return this.windowHeight - 420
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
    handleVerseSelection (item) {
      if (!item) return
      this.verseIndex = item.verseIndex
      this.verseNumberToQuran = item.verseNumberToQuran
      this.numberOfLetters = item.verseText.replace(/ /g, '').length.toString()
      this.numberOfWords = item.verseText.split(' ').length.toString()
      this.verseText = item.verseText
      this.perpareChartData(item)
      this.getWordIndexes(item.verseText)
      this.setTargetedSuraInStore(item)
    },
    getWordIndexes (text) {
      this.wordIndexes = {}
      text.split(' ').map((word, index) => {
        if (!this.wordIndexes[word]) {
          this.wordIndexes[word] = [index + 1]
          return null
        }
        this.wordIndexes[word].push(index + 1)
      })
    },
    runMenuItem (item) {
      if (item === 'showSingleVerse') {
        this.showSingleVerse = true
        return
      }
      if (item === 'showEditVerse') this.showEditVerse = true
    },
    setTargetedSuraInStore (item) {
      this.suraName = item.fileName.replace(/[0-9]/g, '')
      this.suraNumber = item.fileName.replace(/[ء-٩]/g, '').replace(/\s/g, '')
      var target = { fileName: item.fileName, verseIndex: item.verseIndex }
      this.$store.commit('setTarget', target)
    },
    goToverseTextView () {
      this.$store.commit('setActiveView', 'textView')
      this.checkAndGo('singleSura')
    },
    checkAndGo (route) {
      if (this.$router.currentRoute.name !== route) {
        this.$router.push({ name: route })
      }
    },
    perpareChartData (item) {
      var chart = []
      item.verseText.split(' ').map((word, index) => {
        chart[index] = word.length
      })
      this.verseChart = [{ data: chart }]
    },
    setChartToolTip () {
      this.options = {
        ...this.options,
        ...{
          tooltip: {
            custom: (obj) => {
              return (
                '<div class= d-flex pt-2 pa-2">' +
            '<div class=" tipInfo tipInfo2 ">' +
            this.verseText.split(' ')[obj.dataPointIndex] +
            '</div>' +
            '<div class=" tipInfo ">' +
            obj.series[0][obj.dataPointIndex] +
            '<span class="tipLabel"> حروف</span></div>' +
            '</div>'
              )
            },
            shared: true,
            followCursor: true
          }
        }
      }
    },
    setChartXaxis () {
      this.options = {
        ...this.options,
        ...{
          xaxis: {
            labels: { show: true },
            title: {
              offsetY: 0,
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
            tickAmount: 1,
            tickPlacement: 'between'
          }
        }
      }
    },
    setChartSingleVerse () {
      this.options = {
        ...this.options,
        ...{
          chart: {
            offsetY: 10,
            type: 'area',
            toolbar: {
              show: false
            },
            events: {
              mouseMove: (event, chartContext, config) => {
                this.secondInput = this.verseText.split(' ')[config.dataPointIndex]
              }
            }
          }
        }
      }
    },
    setChartDataLabels () {
      this.options = {
        ...this.options,
        ...{
          dataLabels: {
            enabled: true,
            offsetY: 0,
            background: {
              enabled: false
            }
          }
        }
      }
    }
  },
  watch: {
    showSingleVerse () {
      if (this.showSingleVerse) {
        this.setChartToolTip()
        this.setChartSingleVerse()
        this.setChartDataLabels()
        this.setChartXaxis()
      }
    },
    targetFileName () {
      this.showSingleVerse = false
    }
  },
  created () {},
  mounted () { }
}
</script>

<style>
tr.v-data-table__selected {
  background: #7d92f5 !important;
}
.dashTabs {
  height: 35px;
  letter-spacing: 0px;
}
.v-slide-group__content.v-tabs-bar__content {
  height: 35px;
}
</style>
