<template>
  <v-card flat>
    <apexchart
      v-on:markerClick="function(seriesIndex, dataPointIndex, config){handleClick(config)}"
      height="450"
      :width="chartWidth"
      :options="chartOptions"
      :series="series"
      type= 'area'
      ref="myChart"
    />
    <v-overlay :absolute="true" :opacity=".2" :value="isLoading">
      <v-progress-circular color="indigo" indeterminate></v-progress-circular>
    </v-overlay>
  </v-card>

</template>

<script>

import { fetchChartData } from '@/api/api.js'
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'Chart',
  props: ['chartOptions', 'dataType', 'seriesLable'],
  components: { apexchart: VueApexCharts },
  data: () => ({
    isLoading: true,
    series: [],
    chartWidth: 0
  }),
  methods: {
    fetchData () {
      const appApi = process.env.VUE_APP_API_URL
      fetchChartData(appApi, this.$store.state.fileName, this.dataType).then(items => {
        if (this.dataType === 'numberOfWords') {
          this.$refs.myChart.chart.axes.w.config.yaxis[0].title.text = this.seriesLable
          this.$refs.myChart.chart.graphics.w.config.colors[0] = '#42A5F5'
        } else {
          this.$refs.myChart.chart.axes.w.config.yaxis[0].title.text = this.seriesLable
          this.$refs.myChart.chart.graphics.w.config.colors[0] = '#26A69A'
        }
        var series = [{ name: this.seriesLable, data: items }]
        this.series = series
      })
      this.isLoading = false
    },
    handleClick (chartContext) {
      var target = { fileName: this.fileName, verseIndex: chartContext.dataPointIndex + 1 }
      this.$store.commit('setTarget', target)
    }
  },
  computed: { },
  created () {
    this.isLoading = true
    this.fetchData()
  },
  updated () {
  },
  watch: {
    dataType: function () {
      this.fetchData()
    }
  },
  mounted () {
    if (document.getElementsByClassName('v-application')[0].clientWidth > 900) {
      this.chartWidth = document.getElementsByClassName('v-application')[0].clientWidth / 1.6
    } else {
      this.chartWidth = document.getElementsByClassName('v-application')[0].clientWidth - 10
    }
    this.$store.watch(
      state => state.fileName,
      () => {
        this.fetchData()
      })
  }
}
</script>

<style >
.apexcharts-toolbar {
  z-index: 1 !important;
}
.apexcharts-tooltip {
  direction: rtl;
  font-family: '"Roboto", sans-serif !important';
}
.apexcharts-tooltip-text-label{
  margin-right: 6px;
  margin-left: 9px;
}
.apexcharts-tooltip-marker{
  margin-right: -5px;
}
</style>
