<template>
  <div class="chartRow" >
    <v-row>
      <v-radio-group class="d-flex chartTitleWrap" v-model="view" row
        >تواتر
        <v-radio value="words" label="كلمات" color="blue"></v-radio>
        <v-radio value="letters" label="حروف" color="blue"></v-radio>
      </v-radio-group>
    </v-row>
    <chart
      :isLoading="isLoading"
      :series="view === 'letters' ? letterSeries : wordsSeries"
      :options="options"
      :height="height"
    />
  </div>
</template>

<script>
import chartOptions from '../assets/frequecyOptions'
import chart from '../components/chart.vue'

export default {
  name: 'dashFrequency',
  components: { chart },
  props: ['height', 'isLoading', 'letterSeries', 'wordsSeries', 'versesText'],
  data: () => ({
    options: chartOptions,
    view: 'words'

  }),
  computed: {
    tooltipLabel () {
      if (this.view === 'words') return 'كلمات'
      return 'حرف'
    }
  },
  methods: {
    setToolTip () {
      if (!this.versesText) return
      var x = {
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          return '<div class="mr-2 pt-2">' +
                    '<div class="d-flex"><span class="tipInfo"><span class="tipLabel">الآية</span> ' +
                    parseInt(dataPointIndex + 1) + '</span>' +
                    '<span class="tipInfo tipInfo2">' + w.globals.series[0][dataPointIndex] +
                    // '<span class="tipInfo tipInfo2">' + this.letterSeries[dataPointIndex] +
                    ' <span class="tipLabel">' + this.tooltipLabel + '</span></span></div>' +
                    '<p class=" pr-1 pl-2">' + this.versesText[dataPointIndex] + '</p>' +
                  '</div>'
        }
      }
      this.options = {
        ...this.options,
        ...{ tooltip: x }
      }
    }
  },
  watch: {
    versesText () {
      this.setToolTip()
    }
  },
  created () {
  },
  mounted () {
    this.setToolTip()
  }
}
</script>

<style>
 .apexcharts-tooltip {
    background: none !important;
    color: rgb(255, 255, 255);
    font-family: "Tajawal", sans-serif;
    font-size: 16px;
    font-weight: 100 !important;
    white-space:normal;
    max-width: 300px;
    background: #000000bd !important;
  }
  .tipInfo2{
    border-top: 5px solid #4DB6AC !important;
  }
  .tipInfo{
    border: 1px solid rgb(82, 82, 82);
    border-top: 5px solid #2195f3;
    border-radius: 3px;
    margin: 4px;
    padding: 3px;
    height: fit-content;
  }
  .tipLabel{
    font-size: 12px;
  }
</style>
