<template>
  <v-card class="px-4 sura-board-overflow" variant="plain">
    <v-card-text v-if="verse" class="position-absolute">
      <div
        class="freq-verse selected-verse"
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
import { createArabicPattern } from "@/utils/arabicUtils"

const LONG_SURA = 150
const LABEL_STEP = 10
const MARKER_SIZE = 12
const MATCH_SIZE = 6
const HOVER_SIZE = 6
const SELECT_COLOR = "#9E9E9E"

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

const chartPoints = (chart, root) => {
  const markers = [...(root?.querySelectorAll(".apexcharts-series-markers-wrap .apexcharts-marker") || [])]
  if (markers.length) {
    return markers.map((marker) => ({
      x: Number(marker.getAttribute("cx")),
      y: Number(marker.getAttribute("cy")),
    }))
  }
  return (chart?.w?.globals?.pointsArray?.[0] || []).map((point) => ({
    x: point[0],
    y: point[1],
  }))
}

const nearestPoint = (event, chart) => {
  const root = chartRoot(chart)
  const grid = root?.querySelector(".apexcharts-grid")
  const points = chartPoints(chart, root).filter(
    (point) => Number.isFinite(point.x) && Number.isFinite(point.y),
  )
  if (!grid || !points.length) return null
  const x = event.clientX - grid.getBoundingClientRect().left
  return points.reduce((best, point) =>
    Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best,
  )
}

const placeHoverMarker = (event, chart) => {
  const root = chartRoot(chart)
  const host = root?.querySelector(".apexcharts-plot-series")
  if (!host) return
  const point = nearestPoint(event, chart)
  if (!point) {
    host.querySelector(".freq-hover-marker")?.remove()
    return
  }
  const { x, y } = point
  let marker = host.querySelector(".freq-hover-marker")
  if (!marker) {
    marker = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    marker.setAttribute("class", "freq-hover-marker")
    marker.setAttribute("r", String(HOVER_SIZE))
    marker.setAttribute("stroke-width", "2")
    marker.setAttribute("pointer-events", "none")
  }
  const colors = theme.current.value?.colors || theme.themes.value.light.colors
  marker.setAttribute("fill", colors.primary)
  marker.setAttribute("stroke", colors.surface)
  marker.setAttribute("cx", x)
  marker.setAttribute("cy", y)
  host.appendChild(marker)
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
  return verseIndex - 1
})
const matchPoints = computed(() => {
  const word = target.value?.tarteel?.trim()
  const verses = props.verses
  if (!word || !verses?.length) return []
  const regex = createArabicPattern(word)
  const points = []
  verses.forEach((item, index) => {
    if (regex.test(item.verseText)) points.push(index)
  })
  return points
})
const chartOptions = computed(() => {
  const length = props.verses.length
  const options = getChartOptions(length)
  const point = selectedPoint.value
  const matches = matchPoints.value
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
        placeHoverMarker(event, chart)
      })
    },
    mouseLeave: (_event, chart) => {
      chartRoot(chart)?.querySelector(".freq-hover-marker")?.remove()
    },
  }

  options.tooltip = {
    ...options.tooltip,
    intersect: false,
    followCursor: true,
    custom: ({ dataPointIndex }) => {
      const verses = props.verses
      if (dataPointIndex == null || dataPointIndex < 0 || !verses?.length) return ""
      const next = verses[dataPointIndex]
      if (!next?.verseText) return ""
      const text = highlight(next.verseText, target.value?.tarteel) || next.verseText
      const words = countVerseWords(next.verseText)
      const letters = countVerseLetters(next.verseText)
      const selected = dataPointIndex === point ? " selected-verse" : ""
      return `<div class="freq-tip${selected}">
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
    if (index === point || matches.includes(index)) return ""
    if (length > LONG_SURA && index % LABEL_STEP !== 0) return ""
    return value
  }

  const colors = theme.current.value?.colors || theme.themes.value.light.colors
  const stroke = colors["on-highlight"]
  const hasWord = matches.includes(point)
  const discrete = matches
    .filter((index) => index !== point)
    .map((index) => ({
      seriesIndex: 0,
      dataPointIndex: index,
      fillColor: colors.match,
      strokeColor: stroke,
      size: MATCH_SIZE,
      strokeWidth: 2,
    }))

  if (point >= 0 && point < length) {
    discrete.push({
      seriesIndex: 0,
      dataPointIndex: point,
      fillColor: hasWord ? colors.highlight : SELECT_COLOR,
      strokeColor: stroke,
      size: MARKER_SIZE,
      strokeWidth: 2,
    })
  }

  if (!discrete.length) return options

  options.markers = {
    ...options.markers,
    size: [0.01],
    hover: {
      ...options.markers.hover,
      size: MARKER_SIZE + 4,
    },
    discrete,
  }
  return options
})
const height = computed(() => window.innerHeight - 300)

const handleClick = (dataPointIndex) => {
  if (dataPointIndex == null || dataPointIndex < 0) return
  const next = props.verses?.[dataPointIndex]
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
