<template>
  <div class="webKitWidth">
    <appChartOptions :intitalType="chartFreqType" @typeChanged="changeType" />
    <appChart
      :isLoading="isLoading"
      :series="chartFreqSeries"
      :options="chartOptions"
      :height="height"
    />
  </div>
</template>

<script setup>
import appChart from '../components/appChart.vue'
import appChartOptions from './appChartOptions.vue'
import { defineProps } from 'vue'
import { useQuranStore } from '@/stores/app'

const props = defineProps({
  chartFreqSeries: Array,
  height: [Number, String],
  isLoading: Boolean,
  chartOptions: Object,
})

const store = useQuranStore()

const chartFreqType = computed(() => store.state.chartFreqType)

const changeType = type => {
  store.setChartFreqType(type)
}
</script>

<style></style>
