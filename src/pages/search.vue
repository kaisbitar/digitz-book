<template>
  <SearchBoard :inputText="inputText" :searchData="searchData" />
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useQuranStore } from "@/stores/app"

const store = useQuranStore()

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

onMounted(() => {
  store.setActiveRoute("search")
  store.setIsDialog(false)
})
</script>

<style scoped>
.cTable {
  max-width: 600px;
}
</style>
