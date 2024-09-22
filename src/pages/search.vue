<template>
  <v-row no-gutters align="center">
    <v-col cols="4">
      <v-toolbar-title class="mr-4">"{{ inputText }}"</v-toolbar-title>
    </v-col>
    <v-col>
      <AppChipsGroup
        :chipsData="researchTitles"
        :selectedChipIndex="selectedSearchIndex"
        @chipClicked="handleClickedChip"
        @chipRemoved="handleRemovedChip"
        @chipRemoveAll="handleResearchReset"
        closable
      />
    </v-col>
  </v-row>
  <v-container>
    <SearchBoard :inputText="inputText" :searchData="searchData" />
  </v-container>
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"

const store = useQuranStore()
const props = defineProps(["activeView"])
const research = computed(() => store.getResearchResults)
const researchTitles = computed(() =>
  research.value.map((raw) => raw.inputText)
)
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
const handleResearchReset = () => {
  store.resetResearchResults()
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
