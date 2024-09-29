<template>
  <ChartRadioButtons :intitalType="chartFreqType" @typeChanged="changeType" />
  <Chart
    :isLoading="isLoading"
    :series="chartFreqSeries"
    :options="chartOptions"
    :height="height"
  />
</template>

<script setup>
import { defineProps } from "vue"
import { useQuranStore } from "@/stores/app"

const props = defineProps({
  chartFreqSeries: Array,
  height: [Number, String],
  isLoading: Boolean,
  chartOptions: Object,
})

const store = useQuranStore()

const chartFreqType = computed(() => store.getChartFreqType)

const changeType = (type) => {
  store.setChartFreqType(type)
}
</script>

<style></style>
