export const detailMixin = {
  props: ['suraText', 'isLoading', 'includeTab'],
  data: () => ({
    detailElement: '',
    detailCount: 0,
    search: '',
    footerProps: { 'items-per-page-text': '', 'items-per-page-options': [75, 150, -1] },
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
      if (this.occurrences.length === 0) return null
      this.setInitialItem()
    }
  },
  created () {

  },
  mounted () { }
}
