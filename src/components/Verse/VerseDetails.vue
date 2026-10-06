<template>
  <div class="verse-details-container">
    <div class="d-flex align-center justify-space-between mb-2">
      <div class="d-flex align-center">
        <span class="text-h6">
          {{ targetVerse.suraName }} - آية {{ targetVerse.verseIndex }}
        </span>
        <v-btn icon size="small" variant="text" @click="goPreviousVerse">
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
        <v-btn icon size="small" variant="text" @click="goNextVerse">
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
        <v-chip
          v-if="inputText"
          class="ms-2"
          color="primary"
          variant="tonal"
        >
          {{ inputText }}
        </v-chip>
      </div>
      <v-btn icon size="small" variant="text" @click="goBack">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <v-divider class="mb-3" />

    <v-card variant="outlined" class="pa-4 selected-verse">
      <VerseDetailsWords
        :verse="verseText"
        :inputText="inputText"
        :currentWord="currentWord"
        @update:currentWord="openMeaning"
      />
      <div class="text-caption text-medium-emphasis mt-3">
        مصحف {{ mushafNumber }} · {{ wordCount }} كلمة · {{ letterCount }} حرف
      </div>
    </v-card>

    <div class="d-flex justify-center mt-4">
      <AppTabs
        :tabs="tabs"
        :activeTab="activeTab"
        @update:activeTab="activeTab = $event"
      />
    </div>
    <v-window v-model="activeTab" :touch="false">
      <v-window-item value="letters">
        <Chart
          :series="[{ data: letterSeries }]"
          :options="chartOptions"
          height="280"
        />
      </v-window-item>
      <v-window-item value="more" />
    </v-window>

    <v-navigation-drawer
      v-if="isMeaningOpen"
      v-model="isMeaningOpen"
      location="left"
      temporary
      :width="meaningDrawerWidth"
    >
      <div class="d-flex align-center pa-3">
        <v-icon
          icon="mdi-book-open-page-variant-outline"
          size="small"
          class="ml-2"
        />
        <span>تحليل {{ currentWord }}</span>
        <v-btn
          v-if="plainWord"
          class="bg-surface ms-3"
          variant="outlined"
          rounded="pill"
          size="small"
          @click="searchWord"
        >
          <v-icon icon="mdi-magnify" size="small" class="ml-2" />
          رتل {{ plainWord }}
        </v-btn>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          @click="isMeaningOpen = false"
        />
      </div>
      <v-divider />
      <div class="meaning-drawer-body pa-3">
        <WordMeaning
          v-if="isMeaningOpen"
          :word="currentWord"
          :isWordMeaningOpen="true"
        />
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useDisplay } from "vuetify"
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
import { useTarteelStore } from "@/stores/TarteelStore"
import { useCounting } from "@/mixins/counting"
import { filterWords } from "@/utils/wordFilter"
import getChartOptions from "@/assets/frequecyOptions"

const router = useRouter()
const { width } = useDisplay()
const tarteelStore = useTarteelStore()

const emit = defineEmits(["go-back"])
const store = useStore()
const dataStore = useDataStore()
const { countVerseWords, countVerseLetters } = useCounting()

const props = defineProps({
  inputText: String,
})

const activeTab = ref("letters")
const tabs = [
  {
    title: "حروف",
    name: "letters",
    icon: "mdi-chart-line",
    activeIcon: "mdi-chart-areaspline",
  },
  {
    title: "",
    name: "more",
    icon: "mdi-circle-outline",
    activeIcon: "mdi-circle",
  },
]
const currentWord = ref("")
const isMeaningOpen = ref(false)
const plainWord = computed(() =>
  String(currentWord.value || "").replace(/[\u064B-\u0652]/g, ""),
)
const meaningDrawerWidth = computed(() =>
  width.value < 600 ? width.value : 480,
)
const targetVerse = computed(() => store.target)
const oneQuranFile = computed(() => dataStore.getOneQuranFile)
const verseText = computed(() => targetVerse.value?.verseText || "")
const mushafNumber = computed(() => targetVerse.value?.verseNumberToQuran)
const wordCount = computed(() => countVerseWords(verseText.value))
const letterCount = computed(() => countVerseLetters(verseText.value))
const verseWords = computed(() =>
  verseText.value.split(" ").filter(Boolean),
)
const letterSeries = computed(() =>
  verseWords.value.map((word) => countVerseLetters(word)),
)
const chartOptions = computed(() => {
  const options = getChartOptions(verseWords.value.length)
  const words = verseWords.value
  options.dataLabels.formatter = (_value, opts) =>
    words[opts.dataPointIndex] || ""
  options.xaxis.categories = words
  options.xaxis.min = undefined
  options.xaxis.title.text = ""
  options.xaxis.labels.show = false
  return options
})

const goToOffset = (offset) => {
  const current = parseInt(targetVerse.value.verseNumberToQuran)
  const verse = oneQuranFile.value.find(
    (item) => item.verseNumberToQuran === current + offset,
  )
  if (!verse) return
  store.setTarget({ ...verse, tarteel: props.inputText })
}

const goNextVerse = () => goToOffset(1)
const goPreviousVerse = () => goToOffset(-1)

const goBack = () => {
  emit("go-back")
}

const searchWord = () => {
  const word = plainWord.value.trim()
  if (!word) return

  const searched = filterWords(word, dataStore.getOneQuranFile)
  const results = searched.results || []
  if (!results.length) return

  tarteelStore.setLiveLetter(null)
  tarteelStore.setChartVisible(false)
  tarteelStore.setLiveTarteel({
    inputText: word,
    results,
  })
  tarteelStore.commitDraft()
  router.push({ name: "tarteel", query: { view: "list" } })
}

const openMeaning = (word) => {
  if (currentWord.value === word && isMeaningOpen.value) {
    isMeaningOpen.value = false
    return
  }
  currentWord.value = word
  isMeaningOpen.value = true
}

watch(verseText, () => {
  currentWord.value = ""
  isMeaningOpen.value = false
})
</script>

<style lang="scss">
.verse-details-container {
  overflow: auto;
  height: calc(95vh - 100px);
}

.meaning-drawer-body {
  height: calc(100% - 57px);
  overflow: auto;
}
</style>
