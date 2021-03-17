// import { setTimeout } from 'core-js'
import glSearchBox from '../components/glSearchBox'

export const tableOccMixin = {
  name: '',
  components: { glSearchBox },
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
    matchAll: false
  }),
  computed: {},
  methods: {
    getHeight () {
      var tabHeight = 0
      if (this.includeTab) { tabHeight = -70 }
      var heightDif = this.windowHeight - 400 + tabHeight
      return heightDif
    },
    async collapseHeaders (group) {
      return new Promise((resolve) => {
        Object.keys(this.$refs).forEach((k) => {
          this.$refs[k].$el.click()
        })

        resolve()
      })
    },
    rowClicked (item) {
      this.$emit('rowClicked', item)
    },
    searchChanged (search) {
      this.search = search
    },
    matchChanged (matchAll) {
      this.matchAll = matchAll[1]
      this.search = ''
      this.search = matchAll[0]
    }
  },
  created () {
  },
  mounted () {
  }
}
