<template>
  <v-card class="pa-4 sura-board-overflow" variant="plain">
    <!-- <ChartRadioButtons :intitalType="chartFreqType" @typeChanged="changeType" /> -->
    <v-card-text class="position-absolute" v-if="displayVerse">
      <!-- Verse Number -->
      <v-scale-transition>
        <div :key="displayVerse.verseIndex">
          <span class="text-caption count-key-item">آية</span>
          <span class="text-h4 ml-3 count-key-item">
            {{ displayVerse.verseIndex }}
          </span>
        </div>
      </v-scale-transition>

      <!-- Verse Text -->
      <div class="text-h6 mt-1 ml-4 mb-2">
        {{ displayVerse.verseText }}
      </div>

      <!-- Statistics -->
      <v-scale-transition>
        <div
          :key="`${displayVerse.numberOfLetters}-${displayVerse.numberOfWords}`"
          class="text-h4 count-key-item"
        >
          <span>{{ displayVerse.numberOfLetters }}</span>
          <span class="text-caption ml-4">حرف</span>

          <span>{{ displayVerse.numberOfWords }}</span>
          <span class="text-caption ml-4">كلمة</span>
        </div>
      </v-scale-transition>
    </v-card-text>
    <Chart
      :series="chartFreqSeries"
      :options="chartOptions"
      :height="height"
      @mouseMove="handleMouseMove"
      @click="handleClick"
    />
  </v-card>
</template>

<script setup>
import { useStore } from "@/stores/appStore"
const props = defineProps({
  chartFreqSeries: Array,
  chartOptions: Object,
  verses: Array,
})

const store = useStore()

const target = computed(() => store.getTarget)
const displayVerse = ref(props.verses[0])
const chartFreqType = computed(() => store.getChartFreqType)
const height = computed(() => window.innerHeight - 200)

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
  displayVerse.value = props.verses[0]
})
onMounted(async () => {
  await nextTick()
  displayVerse.value = props.verses[0]
})
</script>

<style></style>
