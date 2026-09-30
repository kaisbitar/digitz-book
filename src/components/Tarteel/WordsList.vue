<template>
  <div class="d-flex flex-column words-list-page">
    <WordsListHeader
      :selectedTarteel="selectedTarteel"
      class="mb-4 flex-grow-0"
    />
    <v-divider class="mx-auto flex-grow-0" width="100%"></v-divider>
    <WordMeaning
      :word="selectedTarteel.inputText"
      :isWordMeaningOpen="isWordMeaningOpen"
      :class="isWordMeaningOpen ? 'tarteel-meaning-overflow' : ''"
      @click="isWordMeaningOpen = !isWordMeaningOpen"
    />

    <!-- Pills list - shown when verses are hidden -->
    <div
      v-if="!showVerses"
      class="tarteel-overview-overflow px-sm-4 mt-1 flex-grow-0"
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
        <!-- Close button at the top -->
        <div class="d-flex justify-end pa-2">
          <v-btn
            icon
            size="small"
            variant="text"
            @click="showVerses = false"
          >
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
const isWordMeaningOpen = ref(false)
const showVerses = ref(false)

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
    (item) => item.word === ratl.word
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

watch(currentView, (newView) => {
  overviewScroll()
  // When view changes to list and there's a selected word, show verses
  if (newView === 'list' && tarteelStore.getSelectedRatl?.word) {
    showVerses.value = true
  }
})
watch(selectedRatlIndex, async () => {
  await nextTick()
  overviewScroll()
})

onMounted(() => {
  overviewScroll()
  
  // If coming back from Sura view and a word was already selected, show verses
  if (tarteelStore.getSelectedRatl?.word) {
    showVerses.value = true
  }
})
</script>

<style scoped>
/* Fill the space under the app bar; only the word groups scroll */
.words-list-page {
  height: calc(100vh - 92px);
}

.tarteel-overview-overflow {
  min-height: 0;
  max-height: 40vh;
  overflow-y: auto;
}

/* The verses panel covers the pills area */
.verses-panel {
  min-height: 0;
  background: white;
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
