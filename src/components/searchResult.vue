<template>
  <div>
    <!-- <v-card class="cTable mr-5 pa-4" flat v-bind:key="index" v-for="(item,index) in filteredSearchList"> -->
      <!-- {{ this.$store.state.searchedObject}} -->
      <cTable
      :tableData="filteredSearchList"
      :headers="tableHeaders"
      :search="filteredSearchList.searchTerms.searchedText"
      />
      <!-- :search="item.searchTerms.searchedText" -->
    <!-- </v-card> -->
  </div>
</template>

<script>

// @ is an alias to /src
// import autoComplete from '@/components/autoComplete.vue'
import cTable from './table.vue'

export default {
  name: 'Home',
  components: {
    // autoComplete
    cTable
  },
  data: () => ({
    tableHeaders: [
      { text: 'نص', value: 'verseText', class: 'grey   lighten-2', width: '200' },
      { text: 'السورة', value: 'sura', class: 'grey   lighten-2', width: '10' },
      { text: 'رقم', value: 'verseIndx', class: 'grey   lighten-2 ', width: '10' },
      { text: 'مصحف', value: 'verseNumberToQuran', class: 'grey   lighten-2', width: '10' }
    ]
  }),
  computed: {
    filteredSearchList () {
      var filteredLists = this.$store.state.filteredSearch[this.$store.state.selectedSearch]
      if (!filteredLists) return null
      return filteredLists
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.cTable{
  max-width: 700px;
}
</style>
