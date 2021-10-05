<template>
  <div class="chartRow" >
    <glChart
      :isLoading="isLoading"
      :series="[]"
      :options="options"
      :height="height"
    />
  </div>
</template>

<script>
import chartOptions from '../assets/numbersOptions'
import glChart from './glChart.vue'

export default {
  name: 'dashFrequencySearch',
  components: { glChart },
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
        a.replace(/[ء-٩]/g, '').replace(/\s/g, '').y > b.replace(/[ء-٩]/g, '').replace(/\s/g, '').fileNamey) ? 1 : -1)
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
