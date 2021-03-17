<template>
  <div class="compWrapper">
    <v-row>
      <glTitle
        class="pr-3"
        :numberOfVerses="numberOfVerses"
        :numberOfWords="numberOfWords"
        :numberOfLetters="numberOfLetters"
        :title="inputText"
        :parentSearch="parentSearch"
        :parentcount="parentcount"
        @arrowClick="getNextSearch"
      />
    </v-row>
    <dashbord
      v-if="!isLoading"
      :inputText="inputText"
      @tabChanged="getData"
      :numberOfVerses="numberOfVerses"
      :numberOfWords="numberOfWords"
      :numberOfLetters="numberOfLetters"
      :isLoading="isLoading"
      :wordIndexes="details.wordIndexes"
      :suraTextArray="searchResults"
      :versesBasics="versesBasics"
      :activeTab="activeTab"
    />
  </div>
</template>
<script>
import dashbord from '../components/dashbord.vue'
import glTitle from '../components/glTitle'

export default {
  name: 'search',
  components: {
    dashbord,
    glTitle
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
    letterSeries: [],
    wordsSeries: [],
    searchIndxes: [],
    view: 'suraChart'
  }),
  methods: {
    getData (tab) {
      this.activeTab = tab
      if (this.activeTab === 'numberOfWords') {
        this.fetchSuraDetails()
      }
    },
    getNextSearch (item) {
      if (item === 'up') {
        this.$store.commit(
          'setFilterSelectedIndex',
          this.selectedSearchIndex - 1
        )
        var selectedFilterList = this.filteredSearch[this.selectedSearchIndex]
        this.$store.commit('setFilterSelectedSearch', selectedFilterList)
        return
      }
      this.$store.commit(
        'setFilterSelectedIndex',
        this.selectedSearchIndex + 1
      )
      selectedFilterList = this.filteredSearch[this.selectedSearchIndex]
      this.$store.commit('setFilterSelectedSearch', selectedFilterList)
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
      if (!this.selectedSearch.result) return 0
      return this.selectedSearch.result.length
    },
    activeTab () {
      return this.$store.getters.activeTab
    },
    activeView () {
      return this.$store.getters.activeView
    },
    filteredSearch () {
      return this.$store.state.filteredSearch
    },
    selectedSearch () {
      if (!this.filteredSearch.length > 0) return {}
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
      if (this.selectedSearch === {}) return []
      var filteredList = this.selectedSearch.result
      var searchText = filteredList.map((item) => {
        return item.verseText
      })
      return searchText
    },
    versesBasics () {
      if (this.selectedSearch === {}) return []
      var filteredList = this.selectedSearch.result
      return filteredList
    },
    numberOfWords () {
      if (this.selectedSearch === {}) return 0
      var filteredList = this.selectedSearch.result
      var wordsCount = []
      var numberOfWords = filteredList.map((item) => {
        wordsCount = item.verseText.split(' ').length
        return wordsCount
      })
      return numberOfWords.reduce((a, b) => a + b, 0)
    },
    numberOfLetters () {
      if (this.selectedSearch === {}) return 0
      var filteredList = this.selectedSearch.result
      var lettersCount = []
      var numberOfLetters = filteredList.map((item) => {
        lettersCount = item.verseText.replace(/ /g, '').length
        return lettersCount
      })
      return numberOfLetters.reduce((a, b) => a + b, 0)
    },
    fileName () {
      if (!this.$store.getters.target) return
      return this.$store.getters.target.fileName
    },
    parentSearch () {
      if (!this.$store.getters.selectedSearch.parentSearch) return
      var parentSearch = this.$store.getters.selectedSearch.parentSearch
      if (/\d/.test(parentSearch)) return 'سورة ' + parentSearch.replace(/[0-9]/g, '')
      return parentSearch
    },
    parentcount () {
      if (!this.$store.getters.selectedSearch.resultsCount) return
      return this.$store.getters.selectedSearch.resultsCount
    }
  },
  watch: {
    selectedSearch () {
      if (!this.selectedSearch.result) return
      this.searchIndxes = []
      for (var i = 0; i < this.selectedSearch.result.length; i++) {
        this.searchIndxes.push(
          this.selectedSearch.result[i].verseNumberToQuran
        )
      }
      if (this.activeView === 'sruaChart') return
      this.$store.commit('setActiveView', 'suraChart')
    }
  },
  created () {
  }
}
</script>

<style scoped>
.cTable {
  max-width: 600px;
}
</style>
