<template>
  <AppDialog
    :modelValue="modelValue"
    @update:modelValue="handleClose"
    :closingBarData="closingBarData"
  >
    <v-container>
      <VerseWords :verse="verse" />
    </v-container>
    <SuraFrequency
      :chartFreqSeries="[{ data: verseLengths }]"
      :chartOptions="chartOptions"
      :height="chartWindowHeight"
    />
  </AppDialog>
</template>

<script setup>
import { useCounting } from "@/mixins/counting"
import chartOptionsConfig from "@/assets/frequecyOptions"
import { useQuranStore } from "@/stores/app"
import AppDialog from "./AppDialog.vue"

const store = useQuranStore()
const emit = defineEmits(["update:modelValue"])
const { countVerseWords, countVerseLetters } = useCounting()

const props = defineProps({
  modelValue: Boolean,
  verse: String,
  title: String,
})

const chartOptions = ref(chartOptionsConfig)

const selectedVerseIndex = computed(() => store.getTarget.verseIndex)
const chartWindowHeight = computed(() => window.innerHeight - 260)
const verseLengths = computed(() =>
  props.verse.split(" ").map((word) => word.length)
)

const closingBarData = computed(() => ({
  wordCount: countVerseWords(props.verse),
  letterCount: countVerseLetters(props.verse),
  inputText: `${props.title} : ${selectedVerseIndex.value}`,
}))

const handleClose = () => {
  emit("update:modelValue", false)
}
</script>

<style lang="scss">
.v-container.v-locale--is-rtl.verse-details {
  background: rgb(var(--v-theme-surface));
}
</style>
