<template>
  <v-card variant="plain" class="sura-board-overflow">
    <VueApexCharts :series="series" :options="chartOptions" :height="height" />
  </v-card>
</template>

<script setup>
import VueApexCharts from "vue3-apexcharts"
import { computed } from "vue"
import lettersOptions from "@/assets/lettersOptions"
import { countLettersInQuran } from "@/utils/letterUtils"
import { useDataStore } from "@/stores/dataStore"

const props = defineProps({
  verses: Array,
})

const dataStore = useDataStore()

// Letter order follows the main Quran letters chart (Quran-wide frequency),
// so each letter keeps the same position in every sura.
const letterOrder = computed(() =>
  Object.entries(dataStore.getQuranLetterCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([letter]) => letter),
)

// Vowels are stripped so حروف counts match the sura index.
const suraCounts = computed(() => {
  const text = (props.verses || [])
    .map((verse) => verse.verseText)
    .join(" ")
    .replace(
      /[\u064B-\u0652\u0670\u0656-\u065F\u0610-\u061A\u06D6-\u06ED\s]/g,
      "",
    )

  return countLettersInQuran(text)
})

const counts = computed(() =>
  letterOrder.value.map((letter) => suraCounts.value[letter] || 0),
)

const series = computed(() => [{ name: "عدد الحروف", data: counts.value }])

const chartOptions = computed(() => {
  const options = lettersOptions()
  options.series = series.value
  options.xaxis = {
    ...options.xaxis,
    categories: letterOrder.value,
    min: 0,
    title: { ...options.xaxis.title, text: "حروف السورة" },
  }
  options.dataLabels = { ...options.dataLabels, enabled: true }
  options.yaxis = {
    ...options.yaxis,
    max: Math.ceil(Math.max(...counts.value, 0) * 1.1),
  }
  options.tooltip = {
    ...options.tooltip,
    custom: ({ dataPointIndex, w }) =>
      `<div class="text-h4 pa-1">${w.globals.labels[dataPointIndex]} <span class="text-caption">${w.globals.series[0][dataPointIndex]} مرة</span></div>`,
  }
  return options
})

const height = computed(() => Math.max(320, window.innerHeight - 280))
</script>
