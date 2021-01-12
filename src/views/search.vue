<template>

  <div>
    <searchResult/>
  </div>

</template>
<script>

// @ is an alias to /src
import searchResult from '../components/searchResult.vue'

export default {
  name: 'search',
  components: {
    searchResult
  },
  data: () => ({
    tableHeaders: [
      { text: 'السورة', value: 'sura', class: 'grey   lighten-2' },
      { text: 'رقم', value: 'verseIndx', class: 'grey   lighten-2 ' },
      { text: 'مصحف', value: 'verseNumberToQuran', class: 'grey   lighten-2' },
      { text: 'نص', value: 'verseText', class: 'grey   lighten-2' }
    ]
  }),
  computed: {
    filteredSearchList () {
      var filteredLists = this.$store.state.filteredSearch[this.$store.state.filterSelectedIndex]
      return filteredLists
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.cTable{
  max-width: 600px;
}
</style>
