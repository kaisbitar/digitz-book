<template>
  <v-toolbar flat fixed>
    <v-toolbar-title
      ><span v-html="highlight(inputText, verse.tarteel)"></span> - سورة
      {{ title }}</v-toolbar-title
    >
    <v-btn icon @click="goBack">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
  </v-toolbar>
  <div class="flex-wrap verse-details-container">
    <VerseDetailsCard
      :verse="verse"
      :inputText="inputText"
      :wordSelectedOnChart="wordSelectedOnChart"
    />

    <Chart
      class="d-flex justify-center"
      :series="[{ data: wordsSeries }]"
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import VerseDetailsCard from "./VerseDetailsCard.vue"
import { setVerseChartTooltips } from "@/utils/verseUtils"
import getChartOptions from "@/assets/frequecyOptions"
import { useInputFiltering } from "@/mixins/inputFiltering"

const { highlight } = useInputFiltering()

const emit = defineEmits(["go-back"])

const props = defineProps({
  modelValue: Boolean,
  verse: Object,
  title: String,
  inputText: String,
})
const wordSelectedOnChart = ref([])

const chartOptions = computed(() => getChartOptions(wordsSeries.value.length))
const wordsSeries = computed(() =>
  props.verse.verseText
    .split(" ")
    .reverse()
    .map((word) => word.length)
)

const goBack = () => {
  emit("go-back")
}

// watch(
//   () => props.verse,
//   (newVerse) => {
//     setVerseChartTooltips({
//       reversedVerse: newVerse.split(" ").reverse(),
//       tooltipLabel: " حروف",
//       chartOptions: chartOptions.value,
//       callback: (word) => {
//         wordSelectedOnChart.value.push(word)
//       },
//     })
//   }
// )
</script>

<style lang="scss">
.verse-details-container {
  overflow: scroll;
  height: calc(95vh - 100px);
}
</style>
