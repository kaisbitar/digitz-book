<template>
  <div class="compWrapper">
    <v-row>
      <suraTextInfoBasic
        class="pr-3"
        :numberOfVerses="numberOfVerses"
        :numberOfWords="numberOfVerses"
        :numberOfLetters="numberOfVerses"
        :title="inputText"
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
      :suraTextarray="searchTextarray"
      :versesBasics="versesBasics"
      :activeTab="activeTab"
    />

  </div>
</template>
<script>
import dashbord from '../components/dashbord.vue'
import suraTextInfoBasic from '../components/suraTextInfoBasic'

export default {
  name: 'search',
  components: {
    dashbord,
    suraTextInfoBasic
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
    searchIndxes: []
  }),
  computed: {
    numberOfVerses () {
      if (!this.filteredSearchList.result) return 0
      return this.filteredSearchList.result.length
    },
    activeTab () {
      return this.$store.getters.activeTab
    },
    fullFilteredSearch () {
      return this.$store.getters.filteredSearch
    },
    filterSelectedIndex () {
      return this.$store.state.filterSelectedIndex
    },
    filteredSearchList () {
      if (!this.fullFilteredSearch.length > 0) return {}
      var filteredList = this.fullFilteredSearch[
        this.filterSelectedIndex
      ]
      if (!filteredList) return {}
      return filteredList
    },
    inputText () {
      return this.$store.getters.selectedInput
    },
    searchTextarray () {
      if (!this.fullFilteredSearch.length > 0) return []
      var filteredList = this.fullFilteredSearch[
        this.filterSelectedIndex
      ].result
      var searchText = filteredList.map((item) => {
        return item.verseText
      })
      return searchText
    },
    versesBasics () {
      if (!this.fullFilteredSearch.length > 0) return []
      var filteredList = this.fullFilteredSearch[
        this.filterSelectedIndex
      ].result
      return filteredList
    },
    numberOfWords () {
      if (!this.fullFilteredSearch.length > 0) return 0
      var filteredList = this.fullFilteredSearch[
        this.filterSelectedIndex
      ].result
      var wordsCount = []
      var numberOfWords = filteredList.map((item) => {
        wordsCount = item.verseText.split(' ').length
        return wordsCount
      })
      return numberOfWords.reduce((a, b) => a + b, 0)
    },
    numberOfLetters () {
      if (!this.fullFilteredSearch.length > 0) return 0
      var filteredList = this.fullFilteredSearch[
        this.filterSelectedIndex
      ].result
      var lettersCount = []
      var numberOfLetters = filteredList.map((item) => {
        lettersCount = item.verseText.replace(/ /g, '').length
        return lettersCount
      })
      return numberOfLetters.reduce((a, b) => a + b, 0)
    }
  },
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
          this.filterSelectedIndex + 1
        )
        return
      }
      this.$store.commit(
        'setFilterSelectedIndex',
        this.filterSelectedIndex - 1
      )
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
  watch: {
    filteredSearchList () {
      if (!this.filteredSearchList.result) return
      this.searchIndxes = []
      for (var i = 0; i < this.filteredSearchList.result.length; i++) {
        this.searchIndxes.push(
          this.filteredSearchList.result[i].verseNumberToQuran
        )
      }
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
