
export const appMixin = {
  data () {
    return {
    }
  },
  methods: {
    handleTableClick (rowItem, tableType) {
      if (tableType === 'searchResult') {
        var target = { fileName: rowItem.sura, verseIndex: rowItem.verseIndx }
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
    // try this function for table jump to row
    jumpToSelection: function () {
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
      if (!searchValue) {
        return text
      }
      var searchWordPosition = (text.indexOf(searchValue))
      if (searchWordPosition > 50) {
        var suraChunk = '..' + text.slice(searchWordPosition - 20, 300)
      } else {
        suraChunk = text
      }
      return suraChunk.replace(new RegExp(searchValue, 'gi'), match => {
        return '<span style="background:yellow">' + match + '</span>'
      })
    }
  }
}
