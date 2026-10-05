<template>
  <v-card class="px-4 sura-board-overflow" variant="plain">
    <!-- <ChartRadioButtons :intitalType="chartFreqType" @typeChanged="changeType" /> -->
    <v-card-text v-if="displayVerse" class="position-absolute">
      <v-scale-transition>
        <VerseNumbers
          :key="displayVerse.verseIndex"
          :verse-index="parseInt(displayVerse.verseIndex)"
          :verse-number-to-quran="parseInt(displayVerse.verseNumberToQuran)"
        />
      </v-scale-transition>

      <div
        class="text-h6 mt-1 ml-4 mb-2"
        v-html="highlight(displayVerse.verseText, displayVerse.tarteel)"
      ></div>
      <v-scale-transition>
        <VerseStats
          :key="`${displayVerse.numberOfLetters}-${displayVerse.numberOfWords}`"
          :number-of-words="parseInt(displayVerse.numberOfWords)"
          :number-of-letters="parseInt(displayVerse.numberOfLetters)"
        />
      </v-scale-transition>
    </v-card-text>

    <Chart
      :series="chartFreqSeries"
      :options="chartOptions"
      :height="height"
      @mouse-leave="displayVerse = target"
      @mouse-move="handleMouseMove"
      @click="handleClick"
    />
  </v-card>
</template>

<script setup>
import { useTheme } from "vuetify"
import { useStore } from "@/stores/appStore"
import getChartOptions from "@/assets/frequecyOptions"
import { useInputFiltering } from "@/mixins/inputFiltering"

const LONG_SURA = 150
const LABEL_STEP = 20
const { highlight } = useInputFiltering()
const props = defineProps({
  chartFreqSeries: Array,
  verses: Array,
})

const store = useStore()
const theme = useTheme()

const target = computed(() => store.getTarget)
const displayVerse = ref(target.value)
const chartFreqType = computed(() => store.getChartFreqType)
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

  options.dataLabels.offsetY = -14
  options.dataLabels.background = {
    enabled: true,
    foreColor: labelColor,
  }

  if (length > LONG_SURA) {
    options.dataLabels.formatter = (value, opts) => {
      const index = opts.dataPointIndex
      if (index === point || index % LABEL_STEP === 0) return value
      return ""
    }
  }

  if (point < 0 || point >= length) return options

  options.markers = {
    ...options.markers,
    size: [0.01],
    discrete: [
      {
        seriesIndex: 0,
        dataPointIndex: point,
        fillColor: theme.current.value.colors.highlight,
        strokeColor: theme.current.value.colors["on-highlight"],
        size: 7,
        strokeWidth: 2,
      },
    ],
  }
  return options
})
const height = computed(() => window.innerHeight - 300)

const handleMouseMove = (dataPointIndex) => {
  if (dataPointIndex == null || dataPointIndex < 0) return
  const totalPoints = props.chartFreqSeries[0].data.length
  const verseIndex = totalPoints - dataPointIndex
  displayVerse.value = props.verses[verseIndex - 1]
}
const changeType = (type) => {
  store.setChartFreqType(type)
}

const handleClick = (dataPointIndex) => {
  store.setTarget(displayVerse.value)
  // store.setActiveSuraTab("versesTab")
}
watch(target, () => {
  displayVerse.value = target.value
})
onMounted(async () => {
  await nextTick()
  displayVerse.value = target.value
})
</script>
