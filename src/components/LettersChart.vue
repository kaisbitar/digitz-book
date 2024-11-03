<template>
  <v-card variant="text">
    <v-card-text class="text-center letters-container" v-if="selectedLetter">
      <span class="text-h2 font-weight-bold ml-4">{{
        selectedLetter.letter
      }}</span>
      <span class="text-h4 ml-4"
        >{{ selectedLetter.count }}<span class="text-caption">مرة</span></span
      >
    </v-card-text>
    <VueApexCharts
      ref="chartRef"
      :series="letters.series"
      :options="chartOptions"
      :class="$vuetify.display.xs ? '' : 'px-9'"
    />
  </v-card>
</template>

<script setup>
import VueApexCharts from "vue3-apexcharts"

import { useDataStore } from "@/stores/dataStore"
import { computed, ref, onMounted, watch, nextTick } from "vue"
import lettersOptions from "@/assets/lettersOptions"

const props = defineProps(["letter"])

const chartOptions = computed(() => {
  const baseOptions = lettersOptions()
  if (selectedLetter.value) {
    return {
      ...baseOptions,
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          const currentLetter = letters.value.categories[opts.dataPointIndex]
          return currentLetter === selectedLetter.value.letter ? val : ""
        },
      },
    }
  }
  return baseOptions
})
const dataStore = useDataStore()
const chartRef = ref(null)
const selectedLetter = ref(null)

const letters = computed(() => {
  const data = dataStore.getQuranLetterCounts
  if (!data) return { categories: [], series: [] }

  const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1])
  return {
    categories: sortedEntries.map(([letter]) => letter),
    series: [
      {
        name: "Letter Count",
        data: sortedEntries.map(([letter, count]) => ({
          x: letter,
          y: count,
          letterCount: `${letter}: ${count}`,
        })),
      },
    ],
  }
})

const selectDataPoint = (letterIndex) => {
  if (chartRef.value && chartRef.value.chart) {
    chartRef.value.chart.toggleDataPointSelection(0, letterIndex)
  }
}

const showTooltipForLetter = () => {
  if (!chartRef.value) return
  const letterIndex = letters.value.categories.findIndex(
    (cat) => cat === props.letter
  )
  if (letterIndex === -1) return

  selectedLetter.value = {
    letter: letters.value.categories[letterIndex],
    count: letters.value.series[0].data[letterIndex].y,
  }
  selectDataPoint(letterIndex)
}

watch(
  () => props.letter,
  (newLetter) => {
    if (newLetter) {
      nextTick(() => {
        showTooltipForLetter()
      })
    }
  }
)

onMounted(async () => {
  await nextTick()
  if (props.letter) {
    showTooltipForLetter()
  }
})
</script>

<style scoped>
.letters-container {
  position: absolute;
  z-index: 4;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  width: auto;
}
</style>
