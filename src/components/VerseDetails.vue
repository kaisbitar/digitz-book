<template>
  <v-toolbar rounded elevation="2">
    <v-toolbar-title class="text-center font-weight-bold">
      <span v-html="highlight(inputText, props.inputText)"></span>
      <span v-if="inputText" class="ml-1"> - </span>
      <span class="ml-1">سورة {{ targetVerse.suraName }} </span> -
      <span class="mr-1"> آية {{ targetVerse.verseIndex }}</span>
    </v-toolbar-title>

    <template v-for="button in navigationButtons" :key="button.action">
      <v-btn
        icon
        @click="button.action"
        size="small"
        variant="tonal"
        class="mr-2"
      >
        <v-icon>{{ button.icon }}</v-icon>
      </v-btn>
    </template>
  </v-toolbar>

  <v-container class="verse-details-container">
    <v-row>
      <v-col cols="12">
        <VerseDetailsCard
          :verse="targetVerse"
          :inputText="inputText"
          @update:currentMeaning="currentMeaning = $event"
          @update:currentWord="currentWord = $event"
          @update:loading="isLoading = $event"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <WordMeaningCard
          :variant="'outlined'"
          :meanings="currentMeaning"
          :word="currentWord"
          :expanded="true"
          :cardClass="'word-meaning-verse-details'"
          :loading="isLoading"
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
import { setVerseChartTooltips } from "@/utils/verseUtils"
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
  const nextVerse = await oneQuranFile.value.filter((item) => {
    if (item.verseNumberToQuran == targetVerse.value.verseNumberToQuran + 1) {
      return targetVerse
    }
  })
  store.setTarget({ ...nextVerse[0], tarteel: props.inputText })
}

const goPreviousVerse = async () => {
  const previousVerse = await oneQuranFile.value.filter((item) => {
    if (item.verseNumberToQuran == targetVerse.value.verseNumberToQuran - 1) {
      return targetVerse
    }
  })
  store.setTarget({ ...previousVerse[0], tarteel: props.inputText })
}

const goBack = () => {
  emit("go-back")
}

const navigationButtons = computed(() => [
  {
    icon: "mdi-plus",
    action: goNextVerse,
    title: "Next Verse",
  },
  {
    icon: "mdi-minus",
    action: goPreviousVerse,
    title: "Previous Verse",
  },
  {
    icon: "mdi-arrow-left",
    action: goBack,
    title: "Go Back",
  },
])
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
