<template>
  <div class="webKitWidth" >
    <appChart
      :isLoading="isLoading"
      :series="[]"
      :options="options"
      :height="height"
    />
  </div>
</template>

<script>
import chartOptions from '../assets/numbersOptions'
import appChart from './appChart.vue'

export default {
  name: 'dashFrequencySearch',
  components: { appChart },
  props: ['height', 'isLoading', 'versesBasics'],
  data: () => ({
    options: chartOptions
  }),
  computed: {

  },
  methods: {
    perpareChart () {
      this.setXaxis()
    },
    setXaxis () {
      var count = []
      this.versesBasics.forEach((i) => {
        count[i.fileName] = (count[i.fileName] || 0) + 1
      })
      var s = count.sort((a, b) => (
        a.replace(/[ء-٩]/g, '').replace(/\s/g, '').y > b.replace(/[ء-٩]/g, '').replace(/\s/g, '').fileName) ? 1 : -1)
      console.log(s)
    }
  },
  watch: {
  },
  created () {
    this.perpareChart()
  },
  mounted () {
  }
}
</script>

<style>

</style>
