<template>
  <div class="d-flex flex-column verse-details-container">
    <div class="d-flex align-center justify-space-between mb-2">
      <div class="d-flex align-center">
        <v-btn icon size="small" variant="text" @click="goPreviousVerse">
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
        <span class="text-h6 mx-2">
          {{ targetVerse.suraName }} - آية {{ targetVerse.verseIndex }}
        </span>
        <v-btn icon size="small" variant="text" @click="goNextVerse">
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
        <v-chip
          v-if="inputText"
          class="mr-3"
          color="primary"
          variant="tonal"
          size="large"
        >
          {{ inputText }}
        </v-chip>
      </div>
      <v-btn icon size="small" variant="text" @click="goBack">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <v-divider class="mb-3" />

    <v-card variant="outlined" class="pa-4 mb-4">
      <VerseDetailsCard
        :verse="targetVerse"
        :inputText="inputText"
        :currentWord="currentWord"
        @update:currentMeaning="currentMeaning = $event"
        @update:currentWord="currentWord = $event"
        @update:loading="isLoading = $event"
      />
    </v-card>

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
  </div>
</template>

<script setup>
import getChartOptions from "@/assets/frequecyOptions"
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"

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
