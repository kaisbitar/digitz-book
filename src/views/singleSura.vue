<template>
  <div class="compWrapper">
    <v-row>
      <appTitle
        class="pr-3"
        :numberOfLetters="numberOfLetters"
        @arrowClick="setTargetFromArrow"
        :numberOfVerses="numberOfVerses"
        :numberOfWords="numberOfWords"
        :title="fileName"
      />
      <suraTextSearchResults
        v-if="activeView === 'textView'"
        style="max-width:641px"
        :selectedVerse="suraTargetedVerseIndex"
        :suraTextArray="suraTextArray"
        :inputText="inputText"
      />
    </v-row>
    <keepAlive>
      <suraText
        v-if="activeView === 'textView'"
        :suraTextArray="suraTextWithTashkeel"
        :suraTargetedVerseIndex="suraTargetedVerseIndex"
        :numberOfLetters="numberOfLetters"
        :numberOfVerses="numberOfVerses"
        :numberOfWords="numberOfWords"
        :inputText="inputText"
        :isLoading="isLoading"
    /></keepAlive>
    <keepAlive>
      <dashbord
        v-if="activeView === 'detailView' && details"
        :numberOfLetters="numberOfLetters"
        :wordIndexes="details.wordIndexes"
        :chartFreqSeries="chartFreqSeries"
        :numberOfVerses="numberOfVerses"
        :numberOfWords="numberOfWords"
        :suraTextArray="suraTextArray"
        :chartFreqType="chartFreqType"
        :chartOptions="chartOptions"
        :versesSeries="versesSeries"
        :versesBasics="versesBasics"
        :isLoading="isLoading"
        :activeTab="activeTab"
        :inputText="inputText"
        :title="fileName"
    /></keepAlive>
  </div>
</template>

<script>
import suraTextSearchResults from '../components/suraTextSearchResults'
import chartOptions from '../assets/frequecyOptions'
import suraText from '../components/suraText'
import dashbord from '../components/dashbord'
import appTitle from '../components/appTitle'
import { appMixin } from '../mixins/mixins'

export default {
  name: 'singleSura',
  mixins: [appMixin],
  props: ['activeView'],
  components: {
    suraText,
    dashbord,
    appTitle,
    suraTextSearchResults
  },
  data: () => ({
    chartOptions: chartOptions,
    suraTextWithTashkeel: [],
    numberOfLetters: null,
    numberOfVerses: null,
    numberOfWords: null,
    view: 'detailView',
    suraTextArray: [],
    versesBasics: [],
    isLoading: false,
    letterSeries: [],
    versesSeries: [],
    wordsSeries: [],
    details: {}
  }),
  computed: {
    activeTab () {
      return this.$store.getters.activeTab
    },
    selectedSearch () {
      if (!this.$store.getters.selectedSearch) return
      return this.$store.getters.selectedSearch
    },
    selectedSearchIndex () {
      if (!this.selectedSearch) return
      return this.$store.getters.selectedSearchIndex
    },
    inputText () {
      if (!this.selectedSearch) return null
      return this.selectedSearch.inputText
    },
    suraTargetedVerseIndex () {
      if (!this.suraTargetedVerse) return 1
      if (!this.verseIndex) return 1
      return this.verseIndex
    },
    suraTargetedVerse () {
      return this.$store.getters.target
    },
    verseIndex () {
      return this.$store.getters.target.verseIndex
    },
    fileName () {
      if (!this.$store.getters.target) return '001الفاتحة'
      return this.$store.getters.target.fileName
    },
    suraNumber () {
      if (!this.$store.getters.target) return 1
      return parseInt(this.fileName.replaceAll(/^\D+/g, ''))
    },
    tableQuranIndex () {
      return this.$store.getters.tableQuranIndex
    },
    suraBasics () {
      if (this.fileName === null) return this.tableQuranIndex[1]
      return this.tableQuranIndex[this.suraNumber]
    },
    tooltipLabel () {
      if (this.chartFreqType === 'words') return 'كلمات'
      return 'حرف'
    },
    tooltipLabel2 () {
      if (this.fileName !== '000المصحف') return 'آية'
      return 'سورة'
    },
    chartFreqType () {
      return this.$store.state.chartFreqType
    },
    chartFreqSeries () {
      if (this.chartFreqType === 'words') return this.wordsSeries
      return this.letterSeries
    },
    oneQuranFile () {
      return this.$store.getters.oneQuranFile
    },
    allVersesWithTashkeel () {
      return this.$store.getters.allVersesWithTashkeel
    }
  },
  methods: {
    setSuraBasics () {
      this.numberOfLetters = this.suraBasics.numberOfLetters
      this.numberOfVerses = this.suraBasics.numberOfVerses
      this.numberOfWords = this.suraBasics.numberOfWords
      this.startIndex = this.suraBasics.verseNumberToQuran - 1
      this.endIndex = this.suraBasics.numberOfVerses + this.startIndex
    },
    fetchSuraDetails () {
      this.isLoading = true
      this.$store
        .dispatch('getSuraDetails')
        .then((items) => {
          this.details = items
          return items
        })
        .then(() => {
          this.isLoading = false
        })
    },
    perpareSuraData () {
      var letters = []
      var words = []
      this.versesBasics = []
      this.suraTextArray = []
      this.oneQuranFile.map((item, index) => {
        if (index <= this.startIndex - 1 || index >= this.endIndex) return
        this.versesBasics.push(this.buildVerseObject(item))
        this.suraTextArray.push(item.verseText)
        letters.push(item.verseText.replace(/ /g, '').length)
        words.push(item.verseText.split(' ').length)
      })
      this.letterSeries = [{ data: letters }]
      this.wordsSeries = [{ data: words }]
    },
    buildVerseObject (item) {
      return {
        fileName: item.fileName,
        verseIndex: item.verseIndex.toString(),
        verseText: item.verseText,
        numberOfWords: item.verseText.split(' ').length.toString(),
        numberOfLetters: item.verseText.replace(/ /g, '').length.toString(),
        verseNumberToQuran: item.verseNumberToQuran.toString()
      }
    },
    perpareMushafData () {
      var versesBasics = []
      var suraTextArray = []
      this.oneQuranFile.map((item) => {
        versesBasics.push(this.buildVerseObject(item))
        suraTextArray.push(item.verseText)
      })
      this.versesBasics = versesBasics
      this.suraTextArray = suraTextArray
      this.letterSeries = this.getMushafSeries('numberOfLetters')
      this.versesSeries = this.getMushafSeries('numberOfVerses')
      this.wordsSeries = this.getMushafSeries('numberOfWords')
    },
    getMushafSeries (dataType) {
      var arr = this.tableQuranIndex.map((item) => {
        return item[dataType]
      })
      arr.shift()
      var series = [{ data: arr }]
      return series
    },
    prepareSuraWithTashkeel () {
      this.suraTextWithTashkeel = []
      this.allVersesWithTashkeel.map((item, index) => {
        if (index > (this.startIndex) - 1 && index < this.endIndex) {
          this.suraTextWithTashkeel.push(item)
        }
      })
    },
    setMushafToolTip () {
      var quranToolTip = this.tableQuranIndex.map((item) => {
        return item.fileName.replace(/[0-9]/g, '')
      })
      this.setToolTip(quranToolTip.shift())
    },
    setToolTip (toolTipText) {
      var x = {
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          return '<div class="mr-2 ml-2 pt-2">' +
            '<div class="d-flex"><span class="tipInfo"><span class="tipLabel">' +
            this.tooltipLabel2 + ' </span> ' +
            parseInt(dataPointIndex + 1) + '</span>' +
            '<span class="tipInfo tipInfo2">' + w.globals.series[0][dataPointIndex] +
            ' <span class="tipLabel">' + this.tooltipLabel + '</span></span></div>' +
            '<p class="tipInfo tipText pr-1 pl-2">' + toolTipText[dataPointIndex] + '</p>' +
          '</div>'
        },
        shared: true,
        followCursor: true
      }
      this.chartOptions = {
        ...this.chartOptions,
        ...{ tooltip: x }
      }
    }
  },
  watch: {
    fileName () {
      this.setSuraBasics()
      this.fetchSuraDetails()
      if (this.fileName === '000المصحف') {
        this.perpareMushafData()
        this.suraTextWithTashkeel = this.allVersesWithTashkeel
        this.setMushafToolTip()
        return
      }
      this.perpareSuraData()
      this.prepareSuraWithTashkeel()
      this.setToolTip(this.suraTextArray)
    }
  },
  mounted () {
    this.setSuraBasics()
    this.fetchSuraDetails()
    if (this.fileName === '000المصحف') {
      this.perpareMushafData()
      this.suraTextWithTashkeel = this.allVersesWithTashkeel
      this.setMushafToolTip()
      return
    }
    this.perpareSuraData()
    this.prepareSuraWithTashkeel()
    this.setToolTip(this.suraTextArray)
  },
  created () {
  }
}
</script>

<style>
</style>
