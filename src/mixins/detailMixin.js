export const detailMixin = {
  props: ['indexes', 'occurrences', 'isLoading'],
  data: () => ({
    detailElement: '',
    detailCount: 0,
    search: '',
    footerProps: { 'items-per-page-text': '' },
    selectedId: '',
    showChart: true,
    windowHeight: window.innerHeight,
    groupBy: 'y',
    tab: null
  }),
  computed: {
    fileName () {
      return this.$store.getters.target.fileName
    },
    series () {
      if (!this.occurrences) return
      return [{ data: this.occurrences }]
    }
  },
  methods: {
    setDetailItem (index, item) {
      this.selectedId = item.x

      this.detailElement = item.x
      this.detailCount = item.y
    },
    setInitialItem () {
      this.selectedId = this.occurrences[0].x
      this.detailElement = this.occurrences[0].x
      this.detailCount = this.occurrences[0].y
    }
  },
  watch: {
    indexes () {
      if (!this.occurrences) return null
      this.setInitialItem()
    }
  },
  created () {

  },
  mounted () {
    if (!this.occurrences) return null
    this.setInitialItem()
  }
}
