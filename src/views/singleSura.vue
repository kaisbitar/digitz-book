<template>
  <div class="compWrapper">
    <v-row>
      <suraTextInfoBasic
        class="pr-3"
        :numberOfVerses="numberOfVerses"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :title="fileName"
        @arrowClick="setTargetFromArrow"
      />
      <div class="charSwitch">
        <v-card @click="getView()" outlined>
          <div class="grey lighten-4 d-flex">
            <div
              class="switchLabel"
              :class="[{ active: view === 'suraChart' }]"
            >تفصيل
            </div>
          </div>
        </v-card>
      </div>
    </v-row>
    <keepAlive>
      <suraText
        v-if="view === 'suraText'"
        :inputText="inputText"
        :suraTargetedVerse="suraTargetedVerse"
        :numberOfVerses="numberOfVerses"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :suraTextarray="suraTextarray"
        :isLoading="isLoading"
    /></keepAlive>
    <keepAlive>
      <dashbord
        v-if="view === 'suraChart' && details"
        :title="fileName"
        :numberOfVerses="numberOfVerses"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :isLoading="isLoading"
        :wordIndexes="details.wordIndexes"
        :letterSeries="letterSeries"
        :wordsSeries="wordsSeries"
        :versesSeries="versesSeries"
        :suraTextarray="suraTextarray"
        :versesBasics="versesBasics"
        :activeTab="activeTab"
        :inputText="inputText"
    /></keepAlive>
  </div>
</template>

<script>
import suraText from '../components/suraText.vue'
import dashbord from '../components/dashbord.vue'
import suraTextInfoBasic from '../components/suraTextInfoBasic'
import { appMixin } from '../mixins/mixins'

export default {
  name: 'singleSura',
  mixins: [appMixin],
  components: {
    suraText,
    dashbord,
    suraTextInfoBasic
  },
  data: () => ({
    suraTextarray: [],
    versesBasics: [],
    isLoading: false,
    view: 'suraChart',
    numberOfVerses: null,
    numberOfWords: null,
    numberOfLetters: null,
    iconColor: 'grey',
    details: {},
    letterSeries: [],
    wordsSeries: [],
    versesSeries: []
  }),
  computed: {
    activeTab () {
      return this.$store.getters.activeTab
    },
    filteredSearch () {
      return this.$store.getters.filteredSearch
    },
    filterSelectedIndex () {
      return this.$store.getters.filterSelectedIndex
    },
    inputText () {
      return this.$store.getters.selectedInput
    },
    suraTargetedVerse () {
      return this.$store.getters.target.verseIndex
    },
    fileName () {
      return this.$store.getters.target.fileName
    },
    tableQuranIndex () {
      return this.$store.getters.tableQuranIndex
    },
    suraNumber () {
      return this.$store.getters.target.suraNumber
    },
    suraBasics () {
      if (this.fileName === null) {
        return this.tableQuranIndex[1]
      }
      return this.tableQuranIndex[this.suraNumber]
    }
  },
  methods: {
    fetchSuraBasics () {
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
          fileName: item.fileName.replace(/[0-9]/g, ''),
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
      this.suraTextarray = suraText
      this.versesBasics = versesBasics
      if (this.fileName === '000المصحف') {
        this.fetchMushafChartData()
        return
      }
      this.letterSeries = [{ data: letters }]
      this.wordsSeries = [{ data: words }]
    },
    getView () {
      if (this.view === 'suraText') {
        this.iconColor = 'info'
        this.view = 'suraChart'
        return
      }
      this.iconColor = 'grey'
      this.view = 'suraText'
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
    }
  },
  watch: {
    fileName () {
      this.fetchSuraBasics()
      this.fetchSuraDetails()
      this.perpareSuraData()
    }
  },
  mounted () {
    this.fetchSuraBasics()
    this.fetchSuraDetails()
    this.perpareSuraData()
  }
}
</script>

<style>
</style>
