<template>
  <div class="d-flex flex-column words-list-page">
    <WordsListHeader
      :selectedTarteel="selectedTarteel"
      class="mb-2 flex-grow-0"
    />
    <v-divider
      class="mx-auto mb-2 flex-grow-0 opacity-0"
      width="100%"
    ></v-divider>
    <div v-if="!isPhrase" class="d-flex flex-wrap ga-2 mb-2">
      <v-card
        variant="tonal"
        :color="isWordMeaningOpen ? 'primary' : undefined"
        class="px-3 py-2 d-flex align-center"
        @click="isWordMeaningOpen = !isWordMeaningOpen"
      >
        <v-icon
          icon="mdi-book-open-page-variant-outline"
          size="small"
          class="ml-2"
        />
        <span>تحليل الكلمة</span>
      </v-card>
    </div>
    <v-divider
      class="mx-auto mb-2 flex-grow-0 opacity-0"
      width="100%"
    ></v-divider>

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

    <!-- Pills list - shown when verses are hidden -->
    <div
      v-if="!showVerses"
      class="tarteel-overview-overflow px-sm-4 mt-1 flex-grow-1 d-flex flex-column"
    >
      <AutoWordList
        :items="listItems"
        :selected-word="tarteelStore.getSelectedRatl?.word"
        @select="handleWordSelect"
        @update:currentWordsList="updateResults"
      />
    </div>

    <!-- Verses panel - slides up from the bottom -->
    <transition name="verses-slide">
      <div
        v-if="showVerses && selectedWord"
        class="verses-panel flex-grow-1 d-flex flex-column bg-surface"
      >
        <div
          class="verses-toolbar d-flex align-center justify-space-between px-sm-4 py-2"
        >
          <v-chip
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
          <v-btn icon size="small" variant="text" @click="showVerses = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
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
            :active="parseInt(targetedVerseIndex) === verse.verseNumberToQuran"
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
const meaningDrawerWidth = computed(() =>
  width.value < 600 ? width.value : 480,
)
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

.verses-slide-enter-active,
.verses-slide-leave-active {
  transition: transform 0.35s ease;
}

.verses-slide-enter-from,
.verses-slide-leave-to {
  transform: translateY(100%);
}

.tarteel-overview-overflow {
  min-height: 0;
  overflow-y: auto;
}

/* The verses panel covers the pills area */
.verses-panel {
  min-height: 0;
}

.verses-toolbar {
  position: relative;
  z-index: 1;
  margin-bottom: -5px;
  padding-bottom: 12px;
  background: linear-gradient(
    to bottom,
    rgb(var(--v-theme-surface)) 45%,
    rgba(var(--v-theme-surface), 0)
  );
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
