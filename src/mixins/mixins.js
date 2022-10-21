
export const appMixin = {
  data: () => ({
  }),
  methods: {
    prepareToScroll (item) {
      if (parseInt(item) < 0) return '#v1'
      return '#v' + parseInt(item)
    },
    setTargetFromArrow (direction) {
      if (direction === 'up') return this.$store.commit('setTarget', { fileName: this.tableQuranIndex[this.suraNumber - 1].fileName })
      this.$store.commit('setTarget', { fileName: this.tableQuranIndex[this.suraNumber + 1].fileName })
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
        return '<span style="background:yellow; font-weight: bold;">' + match + '</span>'
      })
    }
  }
}
