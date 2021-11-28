// import { setTimeout } from 'core-js'
import appSearchBox from '../components/appSearchBox'

export const tableOccMixin = {
  name: '',
  components: { appSearchBox },
  props: [
    'tableData',
    'tableHeaders',
    'footerProps',
    'isLoading',
    'groupBy',
    'dataType',
    'includeTab',
    'detailElement'
  ],
  data: () => ({
    windowHeight: window.innerHeight,
    collapseDone: false,
    search: '',
    matchingStatus: false
  }),
  computed: {},
  methods: {
    getTableHeight () {
      var tabHeight = 0
      if (this.includeTab) tabHeight = -20
      return this.windowHeight - 230 + tabHeight
    },
    async collapseHeaders (group) {
      return new Promise((resolve) => {
        Object.keys(this.$refs).forEach((k) => {
          this.$refs[k].$el.click()
        })

        resolve()
      })
    },
    changeSearch (search) {
      this.search = search
    },
    changeMatchingStatus (matchingStatus) {
      this.matchingStatus = matchingStatus[1]
      this.search = matchingStatus[0]
    },
    highlight (text, searchValue) {
      if (!searchValue) return text
      return text.replace(new RegExp(searchValue, 'gi'), (match) => {
        return '<span style="background:yellow">' + match + '</span>'
      })
    }
  },
  created () {
  },
  mounted () {
  }
}
