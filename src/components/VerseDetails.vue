<template>
  <AppDialog
    :modelValue="modelValue"
    @update:modelValue="handleClose"
    :closingBarData="closingBarData"
    class="verse-details-dialog"
  >
    <h2 class="mt-5 mr-5">سورة {{ title }} - الآية {{ selectedVerseIndex }}</h2>
    <v-container class="verse-details">
      <VerseWords
        :verse="verse"
        :inputText="inputText"
        :wordSelectedOnChart="wordSelectedOnChart"
      />
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
import getChartOptions from "@/assets/frequecyOptions"

const store = useQuranStore()
const { countVerseWords, countVerseLetters } = useCounting()
const emit = defineEmits(["update:modelValue"])

const props = defineProps({
  modelValue: Boolean,
  verse: String,
  title: String,
  inputText: String,
})
const wordSelectedOnChart = ref([])

const chartOptions = computed(() => getChartOptions(wordsSeries.value.length))
const wordsSeries = computed(() =>
  props.verse
    .split(" ")
    .reverse()
    .map((word) => word.length)
)

const selectedVerseIndex = computed(() => store.getTarget.verseIndex)
const closingBarData = computed(() => ({
  wordCount: countVerseWords(props.verse),
  letterCount: countVerseLetters(props.verse),
  labels: { word: "كلمة" },
  inputText: props.inputText,
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
      callback: (word) => {
        wordSelectedOnChart.value.push(word)
      },
    })
  }
)
</script>

<style lang="scss">
.verse-details {
  height: 100vh;
}
.verse-details-dialog {
  .dialog-header .v-chip {
    margin-right: 18px;
    margin-left: auto !important;
    margin-top: 2px;
  }
}
</style>
