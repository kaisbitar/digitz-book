// import { setTimeout } from 'core-js'

export const tableOccMixin = {
  name: '',
  components: {},
  props: [
    'tableData',
    'tableHeaders',
    'footerProps',
    'isLoading',
    'groupBy',
    'dataType',
    'selectedId',
    'includeTab'
  ],
  data: () => ({
    windowHeight: window.innerHeight,
    collapseDone: false,
    search: ''
  }),
  computed: {},
  methods: {
    getHeight () {
      var tabHeight = 0
      if (this.includeTab) { tabHeight = -20 }
      var heightDif = this.windowHeight - 290 + tabHeight
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
    }
  },
  created () {
  },
  mounted () {
  }
}
