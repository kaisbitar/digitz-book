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
    'selectedId'
  ],
  data: () => ({
    windowHeight: window.innerHeight,
    collapseDone: false,
    search: ''
  }),
  computed: {},
  methods: {
    getheight () {
      var heightDif = this.windowHeight - 310
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
