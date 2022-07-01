<template>
  <div class="compWrapper">
    <appTitle
      :title="inputText"
      @arrowClick="getNextSearch"
    />
    <dashbord
      v-if="!isLoading"
      :inputText="inputText"
      @tabChanged="getWordsData"
      :chartFreqSeries="[{ data: [] }]"
      :chartFreqType="chartFreqType"
      :chartOptions="chartOptions"
      :numberOfVerses="numberOfVerses"
      :numberOfWords="numberOfWords"
      :numberOfLetters="numberOfLetters"
      :isLoading="isLoading"
      :wordIndexes="details.wordIndexes"
      :suraTextArray="searchResults"
      :versesBasics="versesData"
      :activeTab="activeTab"
    />
  </div>
</template>
<script>
import dashbord from '../components/dashbord.vue'
import appTitle from '../components/appTitle'
import chartOptions from '../assets/frequecyOptions'

export default {
  name: 'search',
  props: ['activeView'],
  components: {
    dashbord,
    appTitle
  },
  data: () => ({
    tableHeaders: [
      { text: 'السورة', value: 'sura', class: 'grey   lighten-2' },
      { text: 'رقم', value: 'verseIndex', class: 'grey   lighten-2 ' },
      { text: 'مصحف', value: 'verseNumberToQuran', class: 'grey   lighten-2' },
      { text: 'نص', value: 'verseText', class: 'grey   lighten-2' }
    ],
    isLoading: false,
    details: {},
    versesData: [],
    letterSeries: [],
    wordsSeries: [],
    view: 'detailView',
    chartFreqType: 'words',
    chartOptions: chartOptions
  }),
  methods: {
    getWordsData (tab) {
      console.log(tab)
      this.activeTab = tab
      if (this.activeTab === 'numberOfWords') {
        this.fetchSuraDetails()
      }
    },
    createVersesData () {
      this.versesData = this.versesBasics.map((item) => {
        return {
          fileName: item.fileName,
          verseIndex: item.verseIndex.toString(),
          verseText: item.verseText,
          numberOfWords: item.verseText.split(' ').length.toString(),
          numberOfLetters: item.verseText.replace(/ /g, '').length.toString(),
          verseNumberToQuran: item.verseNumberToQuran.toString()
        }
      })
    },
    getNextSearch (item) {
      if (item === 'up') {
        this.$store.commit('setSearchIndex', this.selectedSearchIndex - 1)
        return
      }
      this.$store.commit('setSearchIndex', this.selectedSearchIndex + 1)
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
    }
  },
  computed: {
    numberOfVerses () {
      if (!this.selectedSearch) return 0
      return this.selectedSearch.result.length
    },
    activeTab () {
      return this.$store.getters.activeTab
    },
    SearchResults () {
      return this.$store.state.SearchResults
    },
    selectedSearch () {
      if (!this.SearchResults) return {}
      return this.$store.getters.selectedSearch
    },
    selectedSearchIndex () {
      return this.$store.state.selectedSearchIndex
    },
    inputText () {
      if (!this.selectedSearch) return
      return this.selectedSearch.inputText
    },
    searchResults () {
      if (!this.selectedSearch) return []
      return this.selectedSearch.result.map((item) => {
        return item.verseText
      })
    },
    versesBasics () {
      if (!this.selectedSearch) return []
      return this.selectedSearch.result
    },
    numberOfWords () {
      if (!this.selectedSearch) return 0
      return this.selectedSearch.result
        .map((item) => {
          return item.verseText.split(' ').length
        })
        .reduce((a, b) => a + b, 0)
    },
    numberOfLetters () {
      if (!this.selectedSearch) return 0
      return this.selectedSearch.result
        .map((item) => {
          return item.verseText.replace(/ /g, '').length
        })
        .reduce((a, b) => a + b, 0)
    },
    fileName () {
      if (!this.$store.getters.target) return
      return this.$store.getters.target.fileName
    },
    parentcount () {
      if (!this.$store.getters.selectedSearch) return
      return this.$store.getters.selectedSearch.resultsCount
    }
  },
  watch: {
    versesBasics () {
      this.createVersesData()
    }
  },
  mounted () {
    this.$store.commit('setActiveTab', 'numberOfVerses')
    if (this.selectedSearchIndex === -1) {
      this.getNextSearch('down')
    }
    this.createVersesData()
  }
}
</script>

<style scoped>
.cTable {
  max-width: 600px;
}
</style>
