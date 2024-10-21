<template>
  <v-card variant="plain">
    <Chart
      v-if="chartOptions && letters.series"
      ref="chartRef"
      :options="chartOptions"
      :series="letters.series"
    />
  </v-card>
</template>

<script setup>
import { useDataStore } from "@/stores/dataStore"
import { computed, ref, onMounted, watch, nextTick } from "vue"
import getLettersChartOptions from "@/assets/lettersOptionsWide"
import Chart from "./Chart.vue"

const props = defineProps(["letter"])

const chartOptions = computed(() => getLettersChartOptions())
const dataStore = useDataStore()
const chartRef = ref(null)

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

const showTooltipForLetter = () => {
  if (chartRef.value && props.letter) {
    const letterIndex = letters.value.categories.findIndex(
      (cat) => cat === props.letter
    )
    if (letterIndex !== -1 && chartRef.value.dataPointSelection) {
      chartRef.value.dataPointSelection(0, letterIndex)
    }
  }
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
  chartOptions.value.xaxis.categories = letters.value.categories
  if (props.letter) {
    showTooltipForLetter()
  }
})
</script>
