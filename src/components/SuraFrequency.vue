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
let resizeObserver = null

const { updateTableHeight, dynamicTableHeight } = useWindow()

const updateHeight = async () => {
  await nextTick()
  updateTableHeight(suraFrequencyRef)
}

onMounted(async () => {
  window.addEventListener("resize", updateHeight)
  resizeObserver = new ResizeObserver(() => {
    updateHeight()
  })
  if (suraFrequencyRef.value) {
    resizeObserver.observe(suraFrequencyRef.value)
  }
  updateHeight()
})

onUnmounted(() => {
  window.removeEventListener("resize", updateHeight)
})
</script>

<style></style>
