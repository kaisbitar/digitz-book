
export const appMixin = {
  data: () => ({
  }),
  methods: {
    handleTableClick (rowItem, tableType) {
      if (tableType === 'tableSearch') {
        var target = { fileName: rowItem.sura, verseIndex: rowItem.verseIndex }
        this.$store.commit('setTarget', target)
      }
      if (this.$router.currentRoute.name !== 'singleSura') {
        this.$router.push({ name: 'singleSura' })
      }
    },
    prepareToScroll (item) {
      var target = parseInt(item)
      if (target < 0) {
        return '#v1'
      } else {
        return '#v' + target
      }
    },
    setTargetFromArrow (direction) {
      var suraNumber = this.suraNumber
      if (direction === 'up') {
        suraNumber = suraNumber - 1
      } else {
        suraNumber = suraNumber + 1
      }
      var targetrSura = {
        fileName: this.tableQuranIndex[
          suraNumber
        ].fileName
      }
      this.$store.commit('setTarget', targetrSura)
    },
    highlight (text, searchValue) {
      if (!searchValue) {
        if (text.length < 53) { return text } else { return text.slice(0, 53) + '...' }
      }

      var searchWordPosition = (text.indexOf(searchValue))
      if (searchWordPosition > 53) {
        var suraChunk = '...' + text.slice(searchWordPosition - 30)
      } else {
        suraChunk = text
      }
      return suraChunk.replace(new RegExp(searchValue, 'gi'), match => {
        return '<span style="background:yellow">' + match + '</span>'
      })
    }
  }
}
