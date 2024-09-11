<template>
  <div class="webKitWidth">
    <appChartOptions
      :intitalType="chartFreqType"
      @typeChanged="changeType"
    />
    <appChart
      :isLoading="isLoading"
      :series="chartFreqSeries"
      :options="chartOptions"
      :height="height"
    />
  </div>
</template>

<script>
import appChart from '../components/appChart.vue'
import appChartOptions from './appChartOptions.vue'

export default {
  name: 'dashFrequency',
  components: { appChart, appChartOptions },
  props: ['chartFreqSeries', 'height', 'isLoading', 'chartOptions'],
  data: () => ({}),
  computed: {
    chartFreqType () {
      return this.$store.state.chartFreqType
    }
  },
  methods: {
    changeType (type) {
      this.$store.commit('setChartFreqType', type)
    }
  },
  watch: {
  },
  created () {},
  mounted () {
  }
}
</script>

<style>

</style>
