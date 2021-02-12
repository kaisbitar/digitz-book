<template>
  <div>
    <div v-if="filteredSearchList">
        <tableCust
          :tableData="filteredSearchList.result"
          :headers="tableHeaders"
          :search="filteredSearchList.inputText"
          :tableType="'tableSearch'"
          :groupBy="null"
          :elementName="fileName"
        />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import tableCust from './tableCust.vue'

export default {
  name: 'tableSearch',
  components: {
    tableCust
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
td.pa-0.pr-3 {
  border: none !important;
}
</style>
