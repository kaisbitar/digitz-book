<template>
  <div class="d-flex flex-column words-list-page">
    <WordsListHeader
      :selectedTarteel="selectedTarteel"
      class="mb-4 flex-grow-0"
    />
    <v-divider class="mx-auto flex-grow-0" width="100%"></v-divider>
    <WordMeaning
      v-if="!isPhrase"
      :word="selectedTarteel.inputText"
      :isWordMeaningOpen="isWordMeaningOpen"
      :class="isWordMeaningOpen ? 'tarteel-meaning-overflow' : ''"
      @click="isWordMeaningOpen = !isWordMeaningOpen"
    />

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

    <!-- Verses panel - slides up from bottom to cover pills -->
    <v-expand-transition>
      <div
        v-if="showVerses && selectedWord"
        class="verses-panel flex-grow-1 d-flex flex-column"
      >
        <div
          class="verses-toolbar d-flex align-center justify-space-between px-sm-4 py-2"
        >
          <v-chip color="primary" variant="tonal" size="large">
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
            :textToHighlight="selectedWord"
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
    </v-expand-transition>
  </div>
</template>

<script setup>
import { watch, nextTick, computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { useTarteelStore } from "@/stores/TarteelStore"
import { useWindow } from "@/mixins/window"
import { useStore } from "@/stores/appStore"

const route = useRoute()
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
  (props.selectedTarteel?.inputText || "").trim().includes(" "),
)
const isWordMeaningOpen = ref(false)
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
}

.tarteel-overview-overflow {
  min-height: 0;
  overflow-y: auto;
}

/* The verses panel covers the pills area */
.verses-panel {
  min-height: 0;
  background: white;
}

.verses-toolbar {
  position: relative;
  z-index: 1;
  margin-top: 10px;
  margin-bottom: -5px;
  padding-bottom: 20px;
  background: linear-gradient(to bottom, #fff 45%, rgba(255, 255, 255, 0));
}

/* The verses fill the space left under the word pills */
.verses-inline-overflow {
  min-height: 0;
  overflow-y: auto;
}

.tarteel-meaning-overflow {
  height: calc(50vh - 100px);
  overflow: auto;
}
</style>
