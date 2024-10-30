<template>
  <v-card class="sura-chart-overflow" variant="text">
    <v-card-title class="text-h4 mb-4 d-flex">
      سورة {{ title }} - آية {{ verseIndex }}
      <v-btn
        class="mr-auto"
        icon="mdi-arrow-left"
        variant="text"
        @click="goBack"
      ></v-btn>
    </v-card-title>
    <v-card-subtitle>
      <AppMetaData
        :metaData="{
          // رقم: { value: verseIndex },
          كلمة: { value: countVerseWords(verse) },
          حرف: { value: countVerseLetters(verse) },
          مصحف: { value: verseIndexToQuran },
        }"
      />
    </v-card-subtitle>
    <v-card-text>
      <VerseWords
        class="justify-center"
        :style="{ maxWidth: '990px' }"
        :verse="verse"
        :inputText="inputText"
        :wordSelectedOnChart="wordSelectedOnChart"
      />
      <Chart
        class="d-flex justify-center"
        :series="[{ data: wordsSeries }]"
        :options="chartOptions"
      />
    </v-card-text>
    <v-card-text class="d-flex justify-center"> </v-card-text>
  </v-card>
</template>

<script setup>
import { useCounting } from "@/mixins/counting"
import { useStore } from "@/stores/appStore"
import { setVerseChartTooltips } from "@/utils/verseUtils"
import getChartOptions from "@/assets/frequecyOptions"

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

const goBack = () => {
  emit("update:modelValue", false)
}

const verseIndex = computed(() => parseInt(store.getTarget.verseIndex))
const verseIndexToQuran = computed(() =>
  parseInt(store.getTarget.verseNumberToQuran)
)

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

<style lang="scss"></style>
