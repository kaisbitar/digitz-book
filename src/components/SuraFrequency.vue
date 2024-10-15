<template>
  <div ref="suraFrequencyRef" :style="{ height: `${dynamicHeight}px` }">
    <v-card class="pa-4">
      <ChartRadioButtons
        :intitalType="chartFreqType"
        @typeChanged="changeType"
      />
      <Chart
        :series="chartFreqSeries"
        :options="chartOptions"
        :height="height"
      />
    </v-card>
  </div>
</template>

<script setup>
import { useQuranStore } from "@/stores/app"
import { useWindow } from "@/mixins/window"
import { useResizeHandler } from "@/hooks/useResizeObserver"

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

const suraFrequencyRef = ref(null)

const { setContainerHeight, dynamicHeight } = useWindow(suraFrequencyRef)

useResizeHandler({
  elementRef: suraFrequencyRef,
  elementFunc: setContainerHeight,
})

onMounted(async () => {
  await nextTick()
  setContainerHeight()
})

onUnmounted(() => {})
</script>

<style></style>
