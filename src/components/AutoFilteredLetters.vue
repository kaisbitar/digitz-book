<template>
  <v-card variant="tonal">
    <Chart
      v-if="chartOptions && letters.series"
      :options="chartOptions"
      :series="letters.series"
    />
  </v-card>
</template>

<script setup>
import { useDataStore } from "@/stores/dataStore"
import { computed, ref, onMounted } from "vue"
import getLettersChartOptions from "@/assets/lettersOptionsWide"

const chartOptions = computed(() => getLettersChartOptions())

const dataStore = useDataStore()

const letters = computed(() => {
  const data = dataStore.getQuranLetterCounts
  const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1])
  return {
    categories: sortedEntries.map(([letter]) => letter),
    series: [
      {
        name: "Letter Count",
        data: sortedEntries.map(([, count]) => count),
      },
    ],
  }
})

onMounted(async () => {
  await nextTick()
  chartOptions.value.xaxis.categories = letters.value.categories
})
</script>
