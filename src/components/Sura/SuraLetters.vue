<template>
  <v-card variant="plain" class="sura-board-overflow position-relative">
    <v-card
      v-if="wordReport.length"
      variant="outlined"
      class="letters-report bg-background"
    >
      <v-table density="compact" class="bg-background">
        <thead>
          <tr>
            <th class="text-center">ترتيب</th>
            <th class="text-center">حرف</th>
            <th class="text-center">مرة</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in wordReport" :key="item.letter">
            <td class="text-center">{{ item.index + 1 }}</td>
            <td class="text-center text-h6 font-weight-bold">{{ item.letter }}</td>
            <td class="text-center">{{ item.count }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
    <VueApexCharts :series="series" :options="chartOptions" :height="height" />
  </v-card>
</template>

<script setup>
import VueApexCharts from "vue3-apexcharts"
import { computed } from "vue"
import { useTheme } from "vuetify"
import lettersOptions from "@/assets/lettersOptions"
import { countLettersInQuran, lettersOf } from "@/utils/letterUtils"
import { useDataStore } from "@/stores/dataStore"

const props = defineProps({
  verses: Array,
  word: String,
})

const dataStore = useDataStore()
const theme = useTheme()

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

const wordLetters = computed(() => lettersOf(props.word))

const wordReport = computed(() => {
  const report = []
  for (const letter of wordLetters.value) {
    const index = letterOrder.value.indexOf(letter)
    if (index < 0) continue
    report.push({ letter, index, count: counts.value[index] || 0 })
  }
  return report
})

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
  if (!wordLetters.value.length) return options

  const colors = theme.current.value?.colors || theme.themes.value.light.colors
  options.theme = { monochrome: { enabled: false } }
  options.legend = { show: false }
  options.fill = { type: "solid", opacity: 0.9 }
  options.plotOptions = {
    ...options.plotOptions,
    bar: { ...options.plotOptions.bar, distributed: true },
  }
  options.colors = letterOrder.value.map((letter) =>
    wordLetters.value.includes(letter) ? colors.match : "#cccccc",
  )
  return options
})

const height = computed(() => Math.max(320, window.innerHeight - 280))
</script>

<style scoped>
.letters-report {
  position: absolute;
  z-index: 4;
  top: 8px;
  inset-inline-start: 12px;
  width: max-content;
  pointer-events: none;
}
</style>
