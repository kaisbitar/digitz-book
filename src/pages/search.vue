<template>
  <SearchBoard :inputText="inputText" :searchData="searchData" />
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useStore } from "@/stores/appStore"

const store = useStore()

const selectedSearch = computed(() =>
  store.getResearchResults ? store.getSelectedSearch : {}
)
const selectedSearchData = computed(() => selectedSearch.value?.verses || [])

const inputText = computed(() => selectedSearch.value?.inputText || "")

const searchData = computed(() =>
  selectedSearchData.value.map(({ raw }) => ({
    suraNumber: raw.fileName.replace(/[ء-٩]/g, "").replace(/\s/g, ""),
    suraName: raw.fileName.replace(/[0-9]/g, ""),
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
})
</script>

<style scoped></style>
