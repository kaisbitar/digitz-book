<template>
  <div class="webKitWidth">
    <AppChartOptions :intitalType="chartFreqType" @typeChanged="changeType" />
    <AppChart
      :isLoading="isLoading"
      :series="chartFreqSeries"
      :options="chartOptions"
      :height="height"
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useQuranStore } from '@/stores/app'

const props = defineProps({
  chartFreqSeries: Array,
  height: [Number, String],
  isLoading: Boolean,
  chartOptions: Object,
})

const store = useQuranStore()

const chartFreqType = computed(() => store.getChartFreqType)

const changeType = type => {
  store.setChartFreqType(type)
}
</script>

<style></style>
