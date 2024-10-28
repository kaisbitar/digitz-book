<template>
  <div ref="suraFrequencyRef" :style="{ height: `${dynamicHeight}px` }">
    <v-card class="pa-4" :height="dynamicHeight">
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
import { useStore } from "@/stores/appStore"
import { useWindow } from "@/mixins/window"
import { useResizeHandler } from "@/hooks/useResizeObserver"

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
