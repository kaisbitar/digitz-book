<template>
  <div class="d-flex flex-column words-list-page">
    <WordsListHeader :selectedTarteel="selectedTarteel" class="words-list-header mb-2 flex-grow-0" />

    <div class="tarteel-overview-overflow mt-1 flex-grow-1 d-flex flex-column">
      <AutoWordList
        :items="listItems"
        :selected-word="tarteelStore.getSelectedRatl?.word"
        :word="selectedTarteel.inputText"
        :root="selectedTarteel.wordRoot || ''"
        :paginated-items="paginatedItems"
        :exact="isPhrase && !!tarteelStore.getSelectedRatl?.exact"
        :targeted-verse-index="targetedVerseIndex"
        :handle-infinite-scroll="handleInfiniteScroll"
        @select="handleWordSelect"
        @update:currentWordsList="updateResults"
        @verse-selected="handleSelectedVerse"
      />
    </div>
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
const isPhrase = computed(() =>
  (props.selectedTarteel?.inputText || "").includes(" "),
)

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

watch(currentView, () => overviewScroll())
watch(selectedRatlIndex, async () => {
  await nextTick()
  overviewScroll()
})

onMounted(overviewScroll)
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

.words-list-header :deep(.header-title) {
  pointer-events: auto;
  cursor: pointer;
}

.tarteel-overview-overflow {
  min-height: 0;
  overflow-y: auto;
}
</style>
