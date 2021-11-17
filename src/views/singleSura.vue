<template>
  <div class="compWrapper">
    <v-row>
      <appTitle
        class="pr-3"
        :numberOfVerses="numberOfVerses"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :title="fileName"
        @arrowClick="setTargetFromArrow"
      />
      <suraTextSearchResults
        v-if="activeView === 'suraText'"
        :selectedVerse="suraTargetedVerse"
        :inputText="inputText"
        :suraTextArray="suraTextArray"
        style="max-width:641px"
      />
    </v-row>
    <keepAlive>
      <suraText
        v-if="activeView === 'suraText'"
        :inputText="inputText"
        :suraTargetedVerse="suraTargetedVerse"
        :numberOfVerses="numberOfVerses"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :suraTextArray="suraTextWithTashkeel"
        :isLoading="isLoading"
    /></keepAlive>
    <keepAlive>
      <dashbord
        v-if="activeView === 'suraChart' && details"
        :title="fileName"
        :numberOfVerses="numberOfVerses"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :isLoading="isLoading"
        :wordIndexes="details.wordIndexes"
        :letterSeries="letterSeries"
        :wordsSeries="wordsSeries"
        :versesSeries="versesSeries"
        :suraTextArray="suraTextArray"
        :versesBasics="versesBasics"
        :activeTab="activeTab"
        :inputText="inputText"
    /></keepAlive>
  </div>
</template>

<script>
import suraText from '../components/suraText'
import dashbord from '../components/dashbord'
import appTitle from '../components/appTitle'
import { appMixin } from '../mixins/mixins'
import suraTextSearchResults from '../components/suraTextSearchResults'

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
    suraTextArray: [],
    suraTextWithTashkeel: [],
    versesBasics: [],
    isLoading: false,
    view: 'suraChart',
    numberOfVerses: null,
    numberOfWords: null,
    numberOfLetters: null,
    details: {},
    letterSeries: [],
    wordsSeries: [],
    versesSeries: []
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
    suraTargetedVerse () {
      if (!this.$store.getters.target) return 1
      if (!this.$store.getters.target.verseIndex) return 1
      return this.$store.getters.target.verseIndex
    },
    fileName () {
      if (!this.$store.getters.target) return '001الفاتحة'
      return this.$store.getters.target.fileName
    },
    suraNumber () {
      if (!this.$store.getters.target) return 1
      var suraNumber = parseInt(this.$store.getters.target.fileName.replaceAll(/^\D+/g, ''))
      return suraNumber
    },
    tableQuranIndex () {
      return this.$store.getters.tableQuranIndex
    },
    suraBasics () {
      if (this.fileName === null) {
        return this.tableQuranIndex[1]
      }
      return this.tableQuranIndex[this.suraNumber]
    }
  },
  methods: {
    setSuraBasics () {
      this.numberOfVerses = this.suraBasics.numberOfVerses
      this.numberOfWords = this.suraBasics.numberOfWords
      this.numberOfLetters = this.suraBasics.numberOfLetters
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
      var start = this.suraBasics.verseNumberToQuran - 1
      var end = this.suraBasics.numberOfVerses + start
      var letters = []
      var words = []
      var versesBasics = []
      var suraText = this.$store.getters.oneQuranFile.map((item, index) => {
        var obj = {
          verseNumberToQuran: item.verseNumberToQuran,
          numberOfLetters: item.verseText.replace(/ /g, '').length,
          numberOfWords: item.verseText.split(' ').length,
          fileName: item.fileName,
          verseIndex: item.verseIndex,
          verseText: item.verseText
        }
        if (index > start - 1 && index < end) {
          letters.push(item.verseText.replace(/ /g, '').length)
          words.push(item.verseText.split(' ').length)
        }
        if (
          this.fileName === '000المصحف' ||
          (index > start - 1 && index < end)
        ) {
          versesBasics.push(obj)
          return item.verseText
        }
      })
      versesBasics = versesBasics.filter(function (element) {
        return element !== undefined
      })
      suraText = suraText.filter(function (element) {
        return element !== undefined
      })
      this.suraTextArray = suraText
      this.versesBasics = versesBasics
      if (this.fileName === '000المصحف') {
        this.fetchMushafChartData()
        return
      }
      this.letterSeries = [{ data: letters }]
      this.wordsSeries = [{ data: words }]
    },
    fetchMushafChartData () {
      this.wordsSeries = this.getMushafSeries('numberOfWords')
      this.letterSeries = this.getMushafSeries('numberOfLetters')
      this.versesSeries = this.getMushafSeries('numberOfVerses')
    },
    getMushafSeries (dataType) {
      var arr = this.$store.getters.tableQuranIndex.map((item) => {
        return item[dataType]
      })

      arr.shift()
      var series = [{ data: arr }]
      return series
    },
    prepareSuraWithTashkeel () {
      var start = this.suraBasics.verseNumberToQuran - 1
      var end = this.suraBasics.numberOfVerses + start
      var suraTextWithTashkeel = this.$store.getters.allVersesWithTashkeel.map((item, index) => {
        if (
          this.fileName === '000المصحف' ||
          (index > start - 1 && index < end)
        ) {
          return item
        }
      })
      suraTextWithTashkeel = suraTextWithTashkeel.filter(function (element) {
        return element !== undefined
      })
      this.suraTextWithTashkeel = suraTextWithTashkeel
    }
  },
  watch: {
    fileName () {
      this.setSuraBasics()
      this.fetchSuraDetails()
      this.perpareSuraData()
      this.prepareSuraWithTashkeel()
    }
  },
  mounted () {
    this.setSuraBasics()
    this.fetchSuraDetails()
    this.perpareSuraData()
    this.prepareSuraWithTashkeel()
  },
  created () {
  }
}
</script>

<style>
</style>
