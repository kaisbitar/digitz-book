
export const appMixin = {
  data: () => ({
  }),
  methods: {
    prepareToScroll (item) {
      if (parseInt(item) < 0) return '#v1'
      return '#v' + parseInt(item)
    },
    setTargetFromArrow (direction) {
      var suraNumber = this.suraNumber
      if (direction === 'up') suraNumber = suraNumber - 1
      else suraNumber = suraNumber + 1
      this.$store.commit('setTarget', { fileName: this.tableQuranIndex[suraNumber].fileName })
    },
    highlight (text, searchValue) {
      if (!searchValue) {
        return text
        // if (text.length < 53) { return text } else { return text.slice(0, 53) + '...' }
      }

      if (text.indexOf(searchValue) > 53) {
        var suraChunk = '...' + text.slice(text.indexOf(searchValue) - 30)
      } else {
        suraChunk = text
      }
      return suraChunk.replace(new RegExp(searchValue, 'gi'), match => {
        return '<span style="background:yellow">' + match + '</span>'
      })
    }
  }
}
