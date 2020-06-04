<template>
  <v-row
    id="chart"
    class=" mt-5"
  >
    <v-row  class="radios mb-n6">
      <v-radio-group @change="fetchData()" v-model="radios" :mandatory="false" row class="mr-auto">
        <v-radio color="teal lighten-1" label="أحرف" value="NumberOfLetters"></v-radio>
        <v-radio color="blue lighten-1" label="كلمات" value="NumberOfWords"></v-radio>
      </v-radio-group>
    </v-row>
    <apexchart
      v-on:markerClick="function(seriesIndex, dataPointIndex, config){handleClick(config)}"
      height="450"
      :width="divChatWidth"
      min-width="700"
      :options="chartOptions"
      :series="series"
      type= 'area'
      ref="myChart"
    />
  </v-row>
</template>

<script>

import { fetchChartData } from '@/api/api.js'
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'Chart',
  components: { apexchart: VueApexCharts },
  data: () => ({
    showChart: false,
    series: [],
    chartOptions: {
      chart: {
        id: 'chart2'
      },
      fill: {
        type: 'pattern',
        pattern: {
          style: 'verticalLines',
          width: 1,
          height: 3
        }
      },
      theme: {
        palette: 'palette2',
        mode: 'light'
      },
      stroke: {
        curve: 'smooth',
        width: 1,
        colors: ['#000']
      },
      xaxis: {
        title: {
          text: 'آيات',
          offsetX: 0,
          offsetY: 0,
          style: {
            fontSize: '24px', fontFamily: '"Roboto", sans-serif !important'
          }
        },
        min: 1,
        max: undefined
      },
      markers: {
        size: [4, 7]
      },
      yaxis: {
        title: {
          offsetX: -70,
          style: {
            fontSize: '24px', fontFamily: '"Roboto", sans-serif !important'
          }
        },
        min: 0,
        max: undefined
      },
      colors: ['#42A5F5', '#FF8A80'],
      grid: {
        show: true,
        position: 'back',
        colors: ['#000'],
        row: {
          colors: ['#f5f5f5'],
          opacity: 0.4
        },
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 20
        }
      },
      tooltip: {
        x: {
          show: true,
          title: 'sadasd'
        }
      }
    },
    divChatWidth: 200,
    radios: 'NumberOfWords'
  }),
  methods: {
    fetchData () {
      this.isLoading = true
      this.showChart = false
      const appApi = process.env.VUE_APP_API_URL
      fetchChartData(appApi, this.$store.state.fileName, this.radios).then(items => {
        if (this.radios === 'NumberOfWords') {
          this.$refs.myChart.chart.axes.w.config.yaxis[0].title.text = 'كلمات'
          this.$refs.myChart.chart.graphics.w.config.colors[0] = '#42A5F5'
          var seriesLabel = 'عدد الكلمات'
        } else {
          this.$refs.myChart.chart.axes.w.config.yaxis[0].title.text = 'أحرف'
          this.$refs.myChart.chart.graphics.w.config.colors[0] = '#26A69A'
          seriesLabel = 'عدد الأحرف'
        }
        var series = [{ name: seriesLabel, data: items }]
        this.series = series
      })
    },
    handleClick (chartContext) {
      this.$store.commit('setTargetedVerse', chartContext.dataPointIndex + 1)
    }
  },
  computed: { },
  created () {
    this.fetchData()
  },
  updated () {
  },
  mounted () {
    this.divChatWidth = document.getElementById('chart').clientWidth
    this.$store.watch(
      state => state.fileName,
      () => {
        this.fetchData()
      })
  }
}
</script>

<style >
.radios{
  max-width: 510px;
}
.apexcharts-toolbar {
  z-index: 1 !important;
}
#chart{
  max-width: 570px;
  margin: auto;
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
