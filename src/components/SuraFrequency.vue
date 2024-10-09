<template>
  <ChartRadioButtons :intitalType="chartFreqType" @typeChanged="changeType" />
  <Chart :series="chartFreqSeries" :options="chartOptions" :height="height" />
</template>

<script setup>
import { useQuranStore } from "@/stores/app"

const props = defineProps({
  chartFreqSeries: Array,
  chartOptions: Object,
  height: [Number, String],
})

const store = useQuranStore()

const chartFreqType = computed(() => store.getChartFreqType)

const changeType = (type) => {
  store.setChartFreqType(type)
}
</script>

<style></style>
