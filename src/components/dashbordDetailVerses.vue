<template>
  <v-card flat class="dashbordDetailVerses d-flex">
    <occTable
      :tableData="verses"
      :tableHeaders="tableHeaders"
      :isLoading="isLoading"
    />
    {{versesMap[1]}}
  </v-card>
</template>

<script>
import OccTable from './occTable.vue'

export default {
  name: 'dashbordDetailVerses',
  props: ['versesMap', 'isLoading'],
  components: { OccTable },
  data: () => ({
    tableHeaders: [
      { text: 'رقم', value: 'verseIndx', class: 'lighten-4 black--text' },
      { text: 'كلمة', value: 'verseText', class: 'lighten-4 black--text' }
    ],
    verses: []
  }),
  computed: {},
  methods: {
    indexSura (verses) {
      verses = verses.map(
        (items, index) => ({
          ...items
        }
        ))
      this.verses = verses
    },
    prepareTableData () {
      var verses = this.versesMap
      verses = Object.entries(this.versesMap)
      verses = verses.map(post => {
        return post[1]
      })
      this.indexSura(verses)
    }
  },
  watch: {
    versesMap () {
      this.prepareTableData()
    }
  },
  created () {
  },
  mounted () {
    this.prepareTableData()
  }
}
</script>

<style>
</style>
