<template>
  <v-card class="px-4 sura-board-overflow" variant="plain">
    <v-card-text v-if="verse" class="position-absolute">
      <div
        class="freq-verse"
        v-html="highlight(verse.verseText, verse.tarteel)"
      ></div>
      <div class="text-caption text-medium-emphasis mt-1">
        آية {{ verse.verseIndex }} · مصحف {{ verse.verseNumberToQuran }} ·
        {{ wordCount }} كلمة · {{ letterCount }} حرف
      </div>
    </v-card-text>

    <Chart
      :series="chartFreqSeries"
      :options="chartOptions"
      :height="height"
      @click="handleClick"
    />
  </v-card>
</template>

<script setup>
import { useTheme } from "vuetify"
import { useStore } from "@/stores/appStore"
import getChartOptions from "@/assets/frequecyOptions"
import { useInputFiltering } from "@/mixins/inputFiltering"
import { useCounting } from "@/mixins/counting"

const LONG_SURA = 150
const LABEL_STEP = 10
const MARKER_SIZE = 12

const chartRoot = (chart) => chart?.w?.globals?.dom?.baseEl

const raiseMarker = (chart) => {
  const root = chartRoot(chart)
  if (!root) return
  const labels = root.querySelector(".apexcharts-datalabels")
  const marker = root.querySelector(".apexcharts-series-markers-wrap")
  if (!labels || !marker || marker.previousElementSibling === labels) return
  labels.after(marker)
}

const placeTip = (event, root) => {
  const tip = root.querySelector(".apexcharts-tooltip")
  if (!tip) return
  const box = root.getBoundingClientRect()
  let x = event.clientX - box.left + 14
  let y = event.clientY - box.top + 14
  if (x + tip.offsetWidth > box.width) x = event.clientX - box.left - tip.offsetWidth - 14
  if (y + tip.offsetHeight > box.height) y = event.clientY - box.top - tip.offsetHeight - 14
  if (x < 0) x = 8
  if (y < 0) y = 8
  tip.style.left = `${x}px`
  tip.style.top = `${y}px`
}

const placeLine = (event, root) => {
  const line = root.querySelector(".apexcharts-xcrosshairs")
  const grid = root.querySelector(".apexcharts-grid")
  if (!line || !grid) return
  const box = grid.getBoundingClientRect()
  const width = Number(line.getAttribute("width")) || 0
  let x = event.clientX - box.left - width / 2
  if (x < 0) x = 0
  if (x > box.width) x = box.width
  line.setAttribute("x", x)
  line.setAttribute("x1", x)
  line.setAttribute("x2", x)
  line.classList.add("apexcharts-active")
}
const { highlight } = useInputFiltering()
const { countVerseWords, countVerseLetters } = useCounting()
const props = defineProps({
  chartFreqSeries: Array,
  verses: Array,
})

const store = useStore()
const theme = useTheme()

const target = computed(() => store.getTarget)
const verse = computed(() => target.value)
const wordCount = computed(() => countVerseWords(verse.value?.verseText || ""))
const letterCount = computed(() =>
  countVerseLetters(verse.value?.verseText || ""),
)
const selectedPoint = computed(() => {
  const length = props.verses.length
  const verseIndex = Number(target.value?.verseIndex)
  if (!length || !verseIndex) return -1
  return length - verseIndex
})
const chartOptions = computed(() => {
  const length = props.verses.length
  const options = getChartOptions(length)
  const point = selectedPoint.value
  const labelColor = theme.themes.value.light.colors.surface

  options.chart.events = {
    mounted: raiseMarker,
    updated: raiseMarker,
    animationEnd: raiseMarker,
    mouseMove: (event, chart) => {
      const root = chartRoot(chart)
      if (!root || !event) return
      requestAnimationFrame(() => {
        placeTip(event, root)
        placeLine(event, root)
      })
    },
  }

  options.tooltip = {
    ...options.tooltip,
    intersect: false,
    followCursor: true,
    custom: ({ dataPointIndex }) => {
      const verses = props.verses
      if (dataPointIndex == null || dataPointIndex < 0 || !verses?.length) return ""
      const next = verses[verses.length - 1 - dataPointIndex]
      if (!next?.verseText) return ""
      const text = highlight(next.verseText, target.value?.tarteel) || next.verseText
      const words = countVerseWords(next.verseText)
      const letters = countVerseLetters(next.verseText)
      return `<div class="freq-tip">
        <div>${text}</div>
        <div class="freq-tip-stats">آية ${next.verseIndex} · مصحف ${next.verseNumberToQuran} · ${words} كلمة · ${letters} حرف</div>
      </div>`
    },
  }

  options.dataLabels.background = {
    enabled: true,
    foreColor: labelColor,
  }

  options.dataLabels.formatter = (value, opts) => {
    const index = opts.dataPointIndex
    if (index === point) return ""
    if (length > LONG_SURA && index % LABEL_STEP !== 0) return ""
    return value
  }

  if (point < 0 || point >= length) return options

  options.markers = {
    ...options.markers,
    size: [0.01],
    hover: {
      ...options.markers.hover,
      size: MARKER_SIZE + 4,
    },
    discrete: [
      {
        seriesIndex: 0,
        dataPointIndex: point,
        fillColor: theme.current.value.colors.highlight,
        strokeColor: theme.current.value.colors["on-highlight"],
        size: MARKER_SIZE,
        strokeWidth: 2,
      },
    ],
  }
  return options
})
const height = computed(() => window.innerHeight - 300)

const handleClick = (dataPointIndex) => {
  if (dataPointIndex == null || dataPointIndex < 0) return
  const totalPoints = props.chartFreqSeries?.[0]?.data?.length
  if (!totalPoints) return
  const verseIndex = totalPoints - dataPointIndex
  const next = props.verses[verseIndex - 1]
  if (!next) return
  store.setTarget(next)
}
</script>

<style scoped>
.freq-verse {
  font-size: 1.2rem;
  line-height: 1.8;
}

:deep(.apexcharts-tooltip) {
  overflow: visible;
  white-space: normal !important;
}

:deep(.freq-tip) {
  background: rgb(var(--v-theme-background));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.16);
  border-radius: 4px;
  padding: 8px 12px;
  max-width: 320px;
}

:deep(.freq-tip-stats) {
  margin-top: 4px;
  font-size: 12px !important;
  line-height: 1.4;
  opacity: 0.7;
}
</style>
