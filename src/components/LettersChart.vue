<template>
  <v-card variant="plain" class="">
    <v-card-text class="text-center letters-container" v-if="selectedLetter">
      <span class="text-h2 font-weight-bold ml-4">{{
        selectedLetter.letter
      }}</span>
      <span class="text-h4 ml-4">{{ selectedLetter.count }}</span>
    </v-card-text>

    <Chart
      v-if="chartOptions && letters.series"
      ref="chartRef"
      :options="chartOptions"
      :series="letters.series"
      @dataPointSelection="handleDataPointSelection"
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

const handleDataPointSelection = (event, chartContext, config) => {
  const { dataPointIndex } = config
  selectedLetter.value = {
    letter: letters.value.categories[dataPointIndex],
    count: letters.value.series[0].data[dataPointIndex].y,
  }
}

const showTooltipForLetter = () => {
  if (chartRef.value && props.letter) {
    const letterIndex = letters.value.categories.findIndex(
      (cat) => cat === props.letter
    )
    if (letterIndex !== -1 && chartRef.value.dataPointSelection) {
      chartRef.value.dataPointSelection(0, letterIndex)
      selectedLetter.value = {
        letter: props.letter,
        count: letters.value.series[0].data[letterIndex].y,
      }
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
  if (props.letter) {
    showTooltipForLetter()
  }
})
</script>

<style scoped>
.letters-container {
  position: absolute;
  z-index: 4;
  margin-top: 201px;
  margin-right: 91px;
}
</style>
