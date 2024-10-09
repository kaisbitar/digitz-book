<template>
  <AppDialog
    :modelValue="modelValue"
    @update:modelValue="handleClose"
    :closingBarData="closingBarData"
  >
    <v-container>
      <VerseWords :verse="verse" :wordSelectedOnChart="wordSelectedOnChart" />
      <Chart
        :series="[{ data: wordsSeries }]"
        :options="chartOptions"
        :height="300"
      />
    </v-container>
  </AppDialog>
</template>

<script setup>
import { useCounting } from "@/mixins/counting"
import { useQuranStore } from "@/stores/app"
import { setVerseChartTooltips } from "@/utils/verseUtils"
import AppDialog from "./AppDialog.vue"
import getChartOptions from "@/assets/frequecyOptions"

const store = useQuranStore()
const { countVerseWords, countVerseLetters } = useCounting()
const emit = defineEmits(["update:modelValue"])

const props = defineProps({
  modelValue: Boolean,
  verse: String,
  title: String,
})
const wordSelectedOnChart = ref(null)

const wordsSeries = computed(() =>
  props.verse
    .split(" ")
    .reverse()
    .map((word) => word.length)
)
const chartOptions = computed(() => {
  const options = getChartOptions(wordsSeries.value.length)
  options.chart = {
    ...options.chart,
    events: {
      dataPointMouseEnter: function (event, chartContext, opts) {
        const reversedIndex = wordsSeries.value.length - 1 - opts.dataPointIndex
        // if (wordSelectedOnChart.value === reversedIndex) return
        if (wordSelectedOnChart.value === reversedIndex) return

        // wordSelectedOnChart.value = reversedIndex
        console.log(wordSelectedOnChart.value)
        console.log(reversedIndex)
      },
    },
  }
  return options
})

const selectedVerseIndex = computed(() => store.getTarget.verseIndex)
const closingBarData = computed(() => ({
  wordCount: countVerseWords(props.verse),
  letterCount: countVerseLetters(props.verse),
  inputText: `${props.title} : ${selectedVerseIndex.value}`,
  labels: { word: "كلمة" },
}))

const handleClose = () => {
  emit("update:modelValue", false)
}

watch(
  () => props.verse,
  (newVerse) => {
    setVerseChartTooltips({
      reversedVerse: newVerse.split(" ").reverse(),
      tooltipLabel: " حروف",
      chartOptions: chartOptions.value,
    })
  }
)
</script>

<style lang="scss"></style>
