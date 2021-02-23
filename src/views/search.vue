<template>

  <div class="compWrapper">
       <v-row>
         <suraTextInfoBasic
        class="pr-3"
        :numberOfVerses="filteredSearchList.result.length"
        :numberOfWords="filteredSearchList.result.length"
        :numberOfLetters="filteredSearchList.result.length"
        :title="filteredSearchList.inputText"
        @arrowClick="getNextSearch"/>
    </v-row>

    <dashbord
      v-if="!isLoading"
      :title="filteredSearchList.inputText"
      @tabChanged="getData"
      :numberOfVerses="filteredSearchList.result.length"
      :numberOfWords="numberOfWords"
      :numberOfLetters="numberOfLetters"
      :isLoading="isLoading"
      :wordIndexes="details.wordIndexes"
      :suraTextarray="searchTextarray"
      :versesBasics="versesBasics"
      :activeTab="activeTab"
    />
    <!-- :letterSeries="letterSeries"
      :wordsSeries="wordsSeries" -->
  </div>
</template>
<script>

// @ is an alias to /src
// import tableSearch from '../components/tableSearch.vue'
import dashbord from '../components/dashbord.vue'
// import { fetchtableSearchs } from '../api/api'
import suraTextInfoBasic from '../components/suraTextInfoBasic'

export default {
  name: 'search',
  components: {
    dashbord, suraTextInfoBasic
  },
  data: () => ({
    tableHeaders: [
      { text: 'السورة', value: 'sura', class: 'grey   lighten-2' },
      { text: 'رقم', value: 'verseIndex', class: 'grey   lighten-2 ' },
      { text: 'مصحف', value: 'verseNumberToQuran', class: 'grey   lighten-2' },
      { text: 'نص', value: 'verseText', class: 'grey   lighten-2' }
    ],
    numberOfVerses: 0,
    isLoading: false,
    details: {},
    letterSeries: [],
    wordsSeries: [],
    searchIndxes: []
  }),
  computed: {
    activeTab () {
      return this.$store.getters.activeTab
    },
    filteredSearchList () {
      var filteredList = this.$store.state.filteredSearch[this.$store.state.filterSelectedIndex]
      if (!filteredList) return {}
      return filteredList
    },
    searchTextarray () {
      var filteredList = this.$store.state.filteredSearch[this.$store.state.filterSelectedIndex].result
      var searchText = filteredList.map((item) => {
        return item.verseText
      })
      return searchText
    },
    versesBasics () {
      var filteredList = this.$store.state.filteredSearch[this.$store.state.filterSelectedIndex].result
      // var searchText = filteredList.map((item) => {
      //   return item.verseText
      // })
      return filteredList
    },
    numberOfWords () {
      var filteredList = this.$store.state.filteredSearch[this.$store.state.filterSelectedIndex].result
      var wordsCount = []
      var numberOfWords = filteredList.map((item) => {
        wordsCount = (item.verseText.split(' ').length)
        return wordsCount
      })
      return numberOfWords.reduce((a, b) => a + b, 0)
    },
    numberOfLetters () {
      var filteredList = this.$store.state.filteredSearch[this.$store.state.filterSelectedIndex].result
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
      switch (tab) {
        // case 'numberOfVerses':
        //   this.fetchVersesData()
        //   return
        case 'numberOfWords':
          this.fetchSuraDetails()
          break
        // case 'frequency':
        //   this.fetchSuraChartData()
        //   break
      }
    },
    // fetchResults () {
    //   const appApi = process.env.VUE_APP_API_URL
    //   fetchtableSearchs(appApi, this.filteredSearchList.inputText).then(results => {
    //     this.details = results
    //     this.letterSeries = [{ data: results.letterOccurrences }]
    //     this.wordsSeries = [{ data: results.wordOccurrences }]
    //   })
    // },
    getNextSearch (item) {
      console.log(item)
      if (item === 'up') {
        this.$store.commit('setFilterSelectedIndex', this.$store.state.filterSelectedIndex + 1)
        return
      }
      this.$store.commit('setFilterSelectedIndex', this.$store.state.filterSelectedIndex - 1)
    },
    fetchSuraDetails () {
      this.isLoading = true
      this.$store
        .dispatch('getSuraDetails')
        .then((items) => {
          this.details = items
          console.log(items)
          return items
        })
        .then(() => {
          this.isLoading = false
        })
    }
  },
  watch: {
    filteredSearchList () {
      // if (!this.filteredSearchList) return
      this.searchIndxes = []
      for (var i = 0; i < this.filteredSearchList.result.length; i++) {
        this.searchIndxes.push(this.filteredSearchList.result[i].verseNumberToQuran)
      }
      // this.fetchResults()
    }
  },
  created () {
    var target = {
      ...{ fileName: null }
    }
    this.$store.commit('setTarget', target)
  }
}
</script>

<style scoped>
.cTable{
  max-width: 600px;
}
</style>
