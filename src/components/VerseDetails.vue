<template>
  <AppDialog
    :modelValue="modelValue"
    @update:modelValue="handleClose"
    :closingBarData="closingBarData"
    class="verse-details-dialog"
    fullscreen
  >
    <h2 class="mt-5 mr-5">سورة {{ title }}</h2>
    <h5 class="mr-5 d-flex">
      <AppMetaData :metaData="{ آية: { value: verseIndex } }" />
      <AppMetaData :metaData="{ مصحف: { value: verseIndexToQuran } }" />
    </h5>

    <v-container class="verse-details">
      <VerseWords
        :verse="verse"
        :inputText="inputText"
        :wordSelectedOnChart="wordSelectedOnChart"
      />
      <Chart
        :series="[{ data: wordsSeries }]"
        :options="chartOptions"
        :height="400"
      />
    </v-container>
  </AppDialog>
</template>

<script setup>
import { useCounting } from "@/mixins/counting"
import { useStore } from "@/stores/appStore"
import { setVerseChartTooltips } from "@/utils/verseUtils"
import getChartOptions from "@/assets/frequecyOptions"
import AppCountChips from "./AppCountChips.vue"

const store = useStore()
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

const verseIndex = computed(() => parseInt(store.getTarget.verseIndex))
const verseIndexToQuran = computed(() =>
  parseInt(store.getTarget.verseNumberToQuran)
)
const closingBarData = computed(() => ({
  wordCount: countVerseWords(props.verse),
  letterCount: countVerseLetters(props.verse),
  labels: { word: "كلمة", letter: "حرف" },
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
  height: 74vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
// .verse-details-dialog {
//   .dialog-header .app-count-chips {
//     margin-top: -4px;
//     margin-left: auto;
//     margin-right: 17px;
//   }
// }
</style>
