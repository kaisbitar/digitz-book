<template>
  <div class="chartRow" >
    <v-row>
      <v-radio-group class="d-flex chartTitleWrap" v-model="view" row
        >تواتر
        <v-radio value="words" label="كلمات" color="blue"></v-radio>
        <v-radio value="letters" label="حروف" color="blue"></v-radio>
      </v-radio-group>
    </v-row>
    <glChart
      :isLoading="isLoading"
      :series="view === 'letters' ? letterSeries : wordsSeries"
      :options="options"
      :height="height"
    />
  </div>
</template>

<script>
import chartOptions from '../assets/frequecyOptions'
import glChart from '../components/glChart.vue'

export default {
  name: 'dashFrequency',
  components: { glChart },
  props: ['height', 'isLoading', 'letterSeries', 'wordsSeries', 'versesText'],
  data: () => ({
    options: chartOptions,
    view: 'words'

  }),
  computed: {
    tooltipLabel () {
      if (this.view === 'words') return 'كلمات'
      return 'حرف'
    },
    tooltipLabel2 () {
      if (this.fileName !== '000المصحف') return 'آية'
      return 'سورة'
    },
    quranIndex () {
      return this.$store.getters.tableQuranIndex
    },
    fileName () {
      if (!this.$store.getters.target) return
      return this.$store.getters.target.fileName
    }
  },
  methods: {
    prepareToolTipData () {
      if (this.fileName === '000المصحف') {
        this.setQuranToolTip()
        return
      }
      this.setToolTip(this.versesText)
    },
    setToolTip (toolTipText) {
      var x = {
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          return '<div class="mr-2 ml-2 pt-2">' +
                    '<div class="d-flex"><span class="tipInfo"><span class="tipLabel">' + this.tooltipLabel2 + ' </span> ' +
                    parseInt(dataPointIndex + 1) + '</span>' +
                    '<span class="tipInfo tipInfo2">' + w.globals.series[0][dataPointIndex] +
                    ' <span class="tipLabel">' + this.tooltipLabel + '</span></span></div>' +
                    '<p class="tipInfo tipText pr-1 pl-2">' + toolTipText[dataPointIndex] + '</p>' +
                  '</div>'
        },
        shared: true,
        followCursor: true
      }
      this.options = {
        ...this.options,
        ...{ tooltip: x }
      }
    },
    setQuranToolTip () {
      var quranToolTip = this.quranIndex.map((item) => {
        return item.fileName.replace(/[0-9]/g, '')
      })
      quranToolTip.shift()
      this.setToolTip(quranToolTip)
    }
  },
  watch: {
    versesText () {
      this.prepareToolTipData()
    }
  },
  created () {
  },
  mounted () {
    this.prepareToolTipData()
  }
}
</script>

<style>

</style>
