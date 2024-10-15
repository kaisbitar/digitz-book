<template>
  <div ref="suraFrequencyRef" :style="{ height: `${dynamicTableHeight}px` }">
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

const { setContainerHeight, dynamicTableHeight } = useWindow()

const { screen, handleResize } = useResizeHandler({
  elementRef: suraFrequencyRef,
  updateHeight: () => setContainerHeight(suraFrequencyRef),
})

onMounted(async () => {})

onUnmounted(() => {})
</script>

<style></style>
