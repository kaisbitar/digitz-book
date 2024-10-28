<template>
  <v-card class="pa-4 sura-board-overflow">
    <ChartRadioButtons :intitalType="chartFreqType" @typeChanged="changeType" />
    <Chart :series="chartFreqSeries" :options="chartOptions" :height="height" />
  </v-card>
</template>

<script setup>
import { useStore } from "@/stores/appStore"
const props = defineProps({
  chartFreqSeries: Array,
  chartOptions: Object,
})

const store = useStore()

const chartFreqType = computed(() => store.getChartFreqType)
const height = computed(() => window.innerHeight - 200)

const changeType = (type) => {
  store.setChartFreqType(type)
}

onUnmounted(() => {})
</script>

<style></style>
