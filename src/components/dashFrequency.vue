<template>
  <div class="webKitWidth" >
    <appChartOptions
      :type="chartFreqType"
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
  props: ['chartFreqSeries', 'chartFreqType', 'height', 'isLoading', 'versesText', 'chartOptions'],
  data: () => ({}),
  computed: {},
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
