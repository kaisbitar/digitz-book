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
import chartOptions from '../assets/suraDashbordChartOptions.js'
import chart from '../components/chart.vue'

export default {
  name: 'chartFrequency',
  components: { chart },
  props: ['height', 'isLoading', 'letterSeries', 'wordsSeries'],
  data: () => ({
    options: chartOptions,
    view: 'words'

  }),
  computed: {},
  methods: {},
  created () {},
  mounted () {}
}
</script>

<style>
</style>
