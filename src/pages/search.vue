<template>
  <Research
    :chipsData="researchResults"
    :selectedChipIndex="selectedSearchIndex"
    @chipClicked="handleClickedChip"
    @chipRemoved="handleRemovedChip"
  />
  <v-toolbar-title class="ml-10">{{ inputText }}</v-toolbar-title>
  <SearchBoard :inputText="inputText" :searchData="searchData" />
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"

const store = useQuranStore()
const props = defineProps(["activeView"])

const researchResults = computed(() => store.getResearchResults)
const selectedSearch = computed(() =>
  store.getResearchResults ? store.getSelectedSearch : {}
)
const selectedSearchData = computed(() => selectedSearch.value?.result || [])

const inputText = computed(() => selectedSearch.value?.inputText || "")

const searchData = computed(() =>
  selectedSearchData.value.map(({ raw }) => ({
    fileName: raw.fileName,
    verseIndex: String(raw.verseIndex),
    verseText: raw.verseText,
    numberOfWords: String(raw.verseText.split(" ").length),
    numberOfLetters: String(raw.verseText.replace(/ /g, "").length),
    verseNumberToQuran: String(raw.verseNumberToQuran),
  }))
)

const selectedSearchIndex = computed(() => store.getSelectedSearchIndex)

const handleClickedChip = (index) => {
  store.setSearchIndex(index)
}

const handleRemovedChip = (index) => {
  if (index !== selectedSearchIndex.value) {
    store.setSearchIndex(selectedSearchIndex.value - 1)
    return
  }
  store.setSearchIndex(index)
  store.setRemoveSearchItem(index)
}

onMounted(() => {
  if (selectedSearchIndex.value === -1) {
    store.setSearchIndex(0)
  }
  store.setActiveRoute("search")
  store.setActiveView("detailView")
})
</script>

<style scoped>
.cTable {
  max-width: 600px;
}
</style>
