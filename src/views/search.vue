<template>

  <div>
    <!-- <tableSearch/> -->
    <dashbord
      v-if="!isLoading"
      :title="filteredSearchList.inputText"
      @tabChanged="{}"
      :numberOfVerses="filteredSearchList.result.length"
      :numberOfWords="numberOfWords"
      :numberOfLetters="numberOfLetters"
      :isLoading="isLoading"
      :wordIndexes="details.wordIndexes"
      :wordOccurrences="details.wordOccurrences"
      :letterIndexes="details.letterIndexes"
      :letterOccurrences="details.letterOccurrences"
      :letterSeries="letterSeries"
      :wordsSeries="wordsSeries"
    />
  </div>

</template>
<script>

// @ is an alias to /src
// import tableSearch from '../components/tableSearch.vue'
import dashbord from '../components/dashbord.vue'
import { fetchtableSearchs } from '../api/api'

export default {
  name: 'search',
  components: {
    dashbord
  },
  data: () => ({
    tableHeaders: [
      { text: 'السورة', value: 'sura', class: 'grey   lighten-2' },
      { text: 'رقم', value: 'verseIndx', class: 'grey   lighten-2 ' },
      { text: 'مصحف', value: 'verseNumberToQuran', class: 'grey   lighten-2' },
      { text: 'نص', value: 'verseText', class: 'grey   lighten-2' }
    ],
    numberOfVerses: 0,
    numberOfWords: 0,
    numberOfLetters: 0,
    isLoading: false,
    details: {},
    letterSeries: [],
    wordsSeries: [],
    searchIndxes: []
  }),
  computed: {
    filteredSearchList () {
      var filteredLists = this.$store.state.filteredSearch[this.$store.state.filterSelectedIndex]
      if (!filteredLists) return {}
      return filteredLists
    }

  },
  methods: {
    fetchResults () {
      const appApi = process.env.VUE_APP_API_URL
      fetchtableSearchs(appApi, this.filteredSearchList.inputText).then(results => {
        this.details = results
        this.letterSeries = [{ data: results.letterOccurrences }]
        this.wordsSeries = [{ data: results.wordOccurrences }]
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
      this.fetchResults()
    }
  }
}
</script>

<style scoped>
.cTable{
  max-width: 600px;
}
</style>
