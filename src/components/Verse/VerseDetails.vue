<template>
  <v-toolbar rounded elevation="2">
    <v-toolbar-title class="text-center">
      <v-btn icon @click="goPreviousVerse" size="small" class="mx-2">
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
      {{ targetVerse.suraName }} - آية {{ targetVerse.verseIndex }}
      <v-btn icon @click="goNextVerse" size="small" class="mx-2">
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
    </v-toolbar-title>
    <span v-html="highlight(inputText, props.inputText)"></span>

    <v-btn icon @click="goBack" size="small" variant="tonal" class="mr-2">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
  </v-toolbar>

  <v-container class="verse-details-container">
    <v-row>
      <v-col cols="12">
        <VerseDetailsCard
          :verse="targetVerse"
          :inputText="inputText"
          :currentWord="currentWord"
          @update:currentMeaning="currentMeaning = $event"
          @update:currentWord="currentWord = $event"
          @update:loading="isLoading = $event"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <WordMeaningHeader
          :word="currentWord"
          :isWordMeaningOpen="isWordMeaningOpen"
          @close="isWordMeaningOpen = false"
        />
        <WordMeaning
          :word="currentWord"
          :isWordMeaningOpen="isWordMeaningOpen"
          :class="
            isWordMeaningOpen ? 'word-meaning-verse-details' : 'fixed-height'
          "
          @click="isWordMeaningOpen = !isWordMeaningOpen"
        />
      </v-col>

      <v-col cols="12" md="6">
        <Chart
          :series="[{ data: wordsSeries }]"
          :options="chartOptions"
          max-width="500px"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import getChartOptions from "@/assets/frequecyOptions"
import { useInputFiltering } from "@/mixins/inputFiltering"
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
const { highlight } = useInputFiltering()

const emit = defineEmits(["go-back"])
const store = useStore()
const dataStore = useDataStore()
const props = defineProps({
  modelValue: Boolean,
  title: String,
  inputText: String,
})
const currentWord = ref("")
const currentMeaning = ref([])
const isLoading = ref(false)
const isWordMeaningOpen = ref(false)

const targetVerse = computed(() => store.target)

const chartOptions = computed(() => getChartOptions(wordsSeries.value.length))
const wordsSeries = computed(() =>
  targetVerse.value.verseText
    .split(" ")
    .reverse()
    .map((word) => word.length)
)
const oneQuranFile = computed(() => dataStore.getOneQuranFile)

const goNextVerse = async () => {
  const nextVerse = oneQuranFile.value.find(
    (item) =>
      item.verseNumberToQuran ===
      parseInt(targetVerse.value.verseNumberToQuran) + 1
  )
  if (nextVerse) {
    store.setTarget({ ...nextVerse, tarteel: props.inputText })
  }
}

const goPreviousVerse = async () => {
  const previousVerse = oneQuranFile.value.find(
    (item) =>
      item.verseNumberToQuran ===
      parseInt(targetVerse.value.verseNumberToQuran) - 1
  )
  if (previousVerse) {
    store.setTarget({ ...previousVerse, tarteel: props.inputText })
  }
}

const goBack = () => {
  emit("go-back")
}

onMounted(() => {
  currentWord.value = targetVerse.value.verseText.split(" ")[0]
})
</script>

<style lang="scss">
.verse-details-container {
  overflow: auto;
  height: calc(95vh - 100px);
}

.word-meaning-verse-details {
  overflow: auto;
  height: calc(70vh - 109px);
}
</style>
