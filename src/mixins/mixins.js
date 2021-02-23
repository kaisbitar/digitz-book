
export const appMixin = {
  data () {

  },
  methods: {
    handleTableClick (rowItem, tableType) {
      if (tableType === 'tableSearch') {
        var target = { fileName: rowItem.sura, verseIndex: rowItem.verseIndex }
        this.$store.commit('setTarget', target)
        if (this.$router.currentRoute.name !== 'singleSura') {
          this.$router.push({ name: 'singleSura' })
        }
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
      if (direction === 'up') {
        var targetrSura = {
          fileName: this.$store.getters.tableQuranIndex[
            this.$store.getters.target.suraNumber - 1
          ].fileName
        }
        this.$store.commit('setTarget', targetrSura)
        return
      }
      targetrSura = {
        fileName: this.$store.state.tableQuranIndex[
          this.$store.state.target.suraNumber + 1
        ].fileName
      }
      this.$store.commit('setTarget', targetrSura)
    },
    // try this function for table jump to row
    jumpToSelection () {
      this.$nextTick(() => {
        const selected = this.selected[0]
        const page = Math.ceil((this.products.indexOf(selected) + 1) / this.pagination.rowsPerPage)
        this.pagination.sortBy = 'id'
        this.$nextTick(() => {
          this.pagination.page = page
        })
      })
    },
    highlight (text, searchValue) {
      console.log(searchValue)
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
    // highlightNumber (number, searchValue) {
    //   return toString(number).replace(new RegExp(searchValue, 'gi'), match => {
    //     return '<span style="background:yellow">' + match + '</span>'
    //   })
    // }
  }
}
