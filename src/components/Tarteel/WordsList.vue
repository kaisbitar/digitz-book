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
    <div class="tarteel-overview-overflow px-sm-4 mt-1 flex-grow-1">
      <AutoWordList
        :items="listItems"
        :selected-word="tarteelStore.getSelectedRatl?.word"
        @select="handleWordSelect"
        @update:currentWordsList="updateResults"
      />
    </div>
  </div>
</template>

<script setup>
import { watch, nextTick, computed, onMounted } from "vue"
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
})
const emit = defineEmits(["ratl-selected"])

const isWordMeaningOpen = ref(false)

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
  emit("ratl-selected")
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

onMounted(() => {
  overviewScroll()
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

.tarteel-meaning-overflow {
  height: calc(50vh - 100px);
  overflow: auto;
}
</style>
