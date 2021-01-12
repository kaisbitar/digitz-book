<template>
  <div>
    <div v-if="filteredSearchList">
        <cust-table
          :tableData="filteredSearchList.result"
          :headers="tableHeaders"
          :search="filteredSearchList.inputText"
          :tableType="'searchResult'"
          :groupBy="null"
          :elementName="fileName"
        />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import custTable from './custTable.vue'

export default {
  name: 'searchResult',
  components: {
    custTable
  },
  computed: {
    filteredSearchList () {
      var filteredLists = this.$store.state.filteredSearch[
        this.$store.state.filterSelectedIndex
      ]
      if (!filteredLists) return null
      return filteredLists
    },
    fileName () {
      return this.$store.getters.target.fileName
    }
  },
  methods: {},
  data: () => ({
    tableHeaders: [
      { text: 'السورة', value: 'sura', class: 'grey   lighten-2', width: '10' },
      {
        text: 'رقم',
        value: 'verseIndx',
        class: 'grey   lighten-2 ',
        width: '5'
      },
      {
        text: 'نص',
        value: 'verseText',
        class: 'grey   lighten-2',
        width: '900'
      },
      {
        text: 'مصحف',
        value: 'verseNumberToQuran',
        class: 'grey   lighten-2',
        width: '10'
      }
    ]
  })
}
</script>

<style scoped>
.cTable {
}
</style>
