<template>
  <div class="d-flex flex-column words-list-page">
    <WordsListHeader
      :selectedTarteel="selectedTarteel"
      class="words-list-header mb-2 flex-grow-0"
    >
      <div v-if="!isPhrase" class="header-actions d-flex flex-wrap ga-2">
        <v-btn
          variant="outlined"
          rounded="pill"
          size="small"
          class="bg-surface"
          :color="isWordMeaningOpen ? 'primary' : undefined"
          @click="toggleWordMeaning"
        >
          <v-icon
            icon="mdi-book-open-page-variant-outline"
            size="small"
            class="ml-2"
          />
          تحليل الجذر
        </v-btn>
        <v-btn
          variant="outlined"
          rounded="pill"
          size="small"
          class="bg-surface"
          :color="isLetterMeaningOpen ? 'primary' : undefined"
          @click="toggleLetterMeaning"
        >
          <v-icon icon="mdi-abjad-arabic" size="small" class="ml-2" />
          تحليل الحروف
        </v-btn>
      </div>
    </WordsListHeader>

    <v-navigation-drawer
      v-if="!isPhrase"
      v-model="isWordMeaningOpen"
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
        <span>تحليل الكلمة</span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          @click="isWordMeaningOpen = false"
        />
      </div>
      <v-divider />
      <div class="meaning-drawer-body pa-3">
        <WordMeaning
          v-if="isWordMeaningOpen"
          :word="selectedTarteel.inputText"
          :isWordMeaningOpen="true"
        />
      </div>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-if="!isPhrase"
      v-model="isLetterMeaningOpen"
      location="left"
      temporary
      :width="letterDrawerWidth"
    >
      <div class="d-flex align-center pa-3">
        <v-icon icon="mdi-abjad-arabic" size="small" class="ml-2" />
        <span>دلالة الحروف</span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          @click="isLetterMeaningOpen = false"
        />
      </div>
      <v-divider />
      <div class="meaning-drawer-body pa-3">
        <LetterMeanings
          v-if="isLetterMeaningOpen"
          :root="selectedTarteel.wordRoot || selectedTarteel.inputText"
        />
      </div>
    </v-navigation-drawer>

    <!-- Pills stay full height. The verses panel covers them while it slides. -->
    <div class="words-stage flex-grow-1">
      <div
        v-show="!showVerses"
        class="tarteel-overview-overflow mt-1 h-100 d-flex flex-column"
      >
        <AutoWordList
          :items="listItems"
          :selected-word="tarteelStore.getSelectedRatl?.word"
          @select="handleWordSelect"
          @update:currentWordsList="updateResults"
        />
      </div>

      <transition name="verses-slide">
        <div
          v-if="showVerses && selectedWord"
          class="verses-panel d-flex flex-column bg-surface"
        >
          <div class="verses-toolbar d-flex align-center px-sm-4 py-2">
            <v-chip
              class="ms-auto"
              color="primary"
              variant="tonal"
              size="large"
              @click="showVerses = false"
            >
              <span class="ml-1">{{ selectedWord }}</span>
              <span class="text-caption text-grey-darken-1">
                ({{ selectedVerseCount }})
              </span>
            </v-chip>
          </div>

          <!-- Verses list with scroll -->
          <div
            class="verses-inline-overflow px-sm-4 flex-grow-1"
            @scroll="handleInfiniteScroll"
          >
            <VerseCardItem
              v-for="(verse, index) in paginatedItems"
              :item="verse"
              :key="verse.originalIndex ?? verse.verseNumberToQuran"
              :index="index"
              :textToHighlight="
                isPhrase ? selectedTarteel.inputText : selectedWord
              "
              :exact="isPhrase && !!tarteelStore.getSelectedRatl?.exact"
              :active="
                parseInt(targetedVerseIndex) === verse.verseNumberToQuran
              "
              :class="{
                'active-verse-text':
                  parseInt(targetedVerseIndex) === verse.verseNumberToQuran,
              }"
              @click="handleSelectedVerse(verse)"
            />
            <div class="mt-5 mb-6 text-center">صدق الله العظيم</div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { watch, nextTick, computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { useDisplay } from "vuetify"
import { useTarteelStore } from "@/stores/TarteelStore"
import { useWindow } from "@/mixins/window"
import { useStore } from "@/stores/appStore"

const route = useRoute()
const { width } = useDisplay()
const store = useStore()
const tarteelStore = useTarteelStore()
const { scrollToActiveItem } = useWindow()

const props = defineProps({
  selectedTarteel: {
    type: Object,
    required: true,
  },
  paginatedItems: {
    type: Array,
    default: () => [],
  },
  targetedVerseIndex: {
    type: [String, Number],
    default: 0,
  },
  handleInfiniteScroll: {
    type: Function,
    default: () => {},
  },
})
const emit = defineEmits(["ratl-selected", "verseSelected"])

const selectedWord = computed(() => tarteelStore.getSelectedRatl?.word || "")
const selectedVerseCount = computed(
  () => tarteelStore.getSelectedRatl?.verses?.length || 0,
)
const isPhrase = computed(() =>
  (props.selectedTarteel?.inputText || "").includes(" "),
)
const isWordMeaningOpen = ref(false)
const isLetterMeaningOpen = ref(false)
const meaningDrawerWidth = computed(() =>
  width.value < 600 ? width.value : 480,
)
const letterDrawerWidth = computed(() =>
  width.value < 600 ? width.value : 640,
)

const toggleWordMeaning = () => {
  isLetterMeaningOpen.value = false
  isWordMeaningOpen.value = !isWordMeaningOpen.value
}

const toggleLetterMeaning = () => {
  isWordMeaningOpen.value = false
  isLetterMeaningOpen.value = !isLetterMeaningOpen.value
}
const showVerses = ref(isPhrase.value)

const currentView = computed(() => route.query.view)
const selectedRatlIndex = computed(() => tarteelStore.selectedRatlIndex)

// The word list needs the root and search term to label its groups
const listItems = computed(() => {
  const items = [...(props.selectedTarteel.results || [])]
  items.wordRoot = props.selectedTarteel.wordRoot
  items.word = props.selectedTarteel.inputText
  return items
})

const handleWordSelect = (ratl) => {
  const index = props.selectedTarteel.results.findIndex(
    (item) => item.word === ratl.word,
  )
  tarteelStore.setSelectedRatl(ratl)
  tarteelStore.setSelectedRatlIndex(index)

  store.setTarget(ratl.verses[0])

  // Show verses panel when a pill is clicked
  showVerses.value = true
}

const handleSelectedVerse = (verse) => {
  emit("verseSelected", { verse, word: selectedWord.value })
}

const updateResults = (newItems) => {
  props.selectedTarteel.results = [...newItems]
}

const overviewScroll = async () => {
  await nextTick()
  scrollToActiveItem(".active-word-card-item", ".tarteel-overview-overflow")
}

watch(
  () => props.selectedTarteel?.inputText,
  () => {
    showVerses.value = isPhrase.value
  },
)
watch(currentView, () => overviewScroll())
watch(selectedRatlIndex, async () => {
  await nextTick()
  overviewScroll()
})

onMounted(async () => {
  overviewScroll()
  if (!tarteelStore.takeOpenedVerse()) return

  showVerses.value = true
  await nextTick()
  scrollToActiveItem(
    ".verses-inline-overflow .active-verse-text",
    ".verses-inline-overflow",
  )
})
</script>

<style scoped>
/* Fill the space under the app bar; only the word groups scroll */
.words-list-page {
  height: calc(100vh - 92px);
  overflow: hidden;
}

.words-list-header {
  position: relative;
  z-index: 210;
  pointer-events: none;
}

.words-list-header :deep(.v-btn) {
  pointer-events: auto;
}

.verses-slide-enter-active,
.verses-slide-leave-active {
  transition: transform 0.35s ease;
}

.verses-slide-enter-from,
.verses-slide-leave-to {
  transform: translateY(100%);
}

.words-stage {
  position: relative;
  min-height: 0;
}

.tarteel-overview-overflow {
  min-height: 0;
  overflow-y: auto;
}

/* Covers the pills. Stays out of the flex flow so the list keeps its full height. */
.verses-panel {
  position: absolute;
  inset: 0;
  min-height: 0;
}

.verses-toolbar {
  position: relative;
  z-index: 200;
  margin-top: -58px;
  /* padding-bottom: 12px; */
  /* background: rgb(var(--v-theme-background)); */
}

@media (max-width: 600px) {
  .header-actions {
    flex: 1 0 100%;
    justify-content: flex-start;
  }

  .verses-toolbar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    margin-top: -90px;
    pointer-events: none;
  }

  .verses-toolbar :deep(.v-chip) {
    pointer-events: auto;
  }
}

/* The verses fill the space left under the word pills */
.verses-inline-overflow {
  min-height: 0;
  overflow-y: auto;
}

.meaning-drawer-body {
  height: calc(100% - 57px);
  overflow: auto;
}
</style>
