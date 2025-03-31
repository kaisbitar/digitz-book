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
import { useStore } from "@/stores/appStore"
import getChartOptions from "@/assets/frequecyOptions"

import { useInputFiltering } from "@/mixins/inputFiltering"
const { search, highlight } = useInputFiltering()
const props = defineProps({
  chartFreqSeries: Array,
  verses: Object,
  verses: Array,
})

const store = useStore()

const target = computed(() => store.getTarget)
const displayVerse = ref(target.value)
const chartFreqType = computed(() => store.getChartFreqType)
const chartOptions = computed(() => getChartOptions(props.verses.length))
const height = computed(() => window.innerHeight - 300)

const handleMouseMove = (dataPointIndex) => {
  const totalPoints = props.chartFreqSeries[0].data.length
  const verseIndex = totalPoints - dataPointIndex
  displayVerse.value = props.verses[verseIndex - 1]
}
const changeType = (type) => {
  store.setChartFreqType(type)
}

const handleClick = (dataPointIndex) => {
  store.setTarget(displayVerse.value)
  store.setActiveSuraTab("versesTab")
}
watch(target, () => {
  displayVerse.value = target.value
})
onMounted(async () => {
  await nextTick()
  displayVerse.value = target.value
})
</script>

<style></style>
