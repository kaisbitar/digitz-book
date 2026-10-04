<template>
  <div class="d-flex justify-space-between">
    <!-- <v-btn
      class="float-end"
      @click="toggleToolbar"
      icon
      variant="tonal"
      size="small"
    >
      <v-icon>{{
        isToolbarExpanded ? "mdi-chevron-up" : "mdi-chevron-down"
      }}</v-icon>
    </v-btn> -->
    <div>
      <span class="text-h4 ml-1">{{ suraNumber }}</span>
      <span class="text-h4 ml-4">{{ target.suraName }}</span>
      <AppHeaderMetrics :metrics="formattedMetrics" />
    </div>

    <v-chip
      v-if="searchedWord"
      closable
      color="primary"
      variant="tonal"
      size="large"
      @click="openSearchedWord"
      @click:close="clearSearchedWord"
    >
      {{ searchedWord }}
    </v-chip>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import { useDataStore } from "@/stores/dataStore"
import { useStore } from "@/stores/appStore"
import { useTarteelStore } from "@/stores/TarteelStore"
import { useRouter } from "vue-router"
import { filterWords } from "@/utils/wordFilter"
import { fetchWordRoot } from "@/utils/dictionaryUtils.js"

const router = useRouter()
const dataStore = useDataStore()
const store = useStore()
const tarteelStore = useTarteelStore()

const props = defineProps({
  title: String,
  showMetaData: Boolean,
  isToolbarExpanded: Boolean,
})

const emit = defineEmits(["expandedToggle"])

const toggleToolbar = () => {
  emit("expandedToggle")
}

const openSearchedWord = async () => {
  const word = searchedWord.value.trim()
  if (!word) return

  const items = [...tarteelStore.getStoredTarteels].reverse()
  const hasWord = (item) =>
    (item.inputText || "").trim() === word ||
    item.results?.some((result) => result.word === word)

  let match = items.find(hasWord)
  if (!match) {
    const wordRoot = word.length >= 2 ? await fetchWordRoot(word) : null
    const searched = filterWords(word, dataStore.getOneQuranFile, wordRoot, {
      removeTashkeel: true,
    })
    const results = searched.results || []
    if (!results.length) return
    results.wordRoot = wordRoot
    tarteelStore.setLiveTarteel({ inputText: word, results, wordRoot })
    match = tarteelStore.getSelectedTarteel
  }
  if (!match) return

  const verseId = target.value?.verseNumberToQuran
  const ratl =
    match.results?.find((item) => item.word === word) ||
    match.results?.find((item) =>
      item.verses?.some((verse) => verse.verseNumberToQuran == verseId),
    ) ||
    match.results?.[0] ||
    null

  tarteelStore.setLiveLetter(null)
  tarteelStore.setChartVisible(false)
  tarteelStore.setSelectedTarteelId(match.id)
  tarteelStore.setSelectedRatl(ratl)
  tarteelStore.setSelectedRatlIndex(
    ratl ? match.results.findIndex((item) => item.word === ratl.word) : null,
  )
  if (ratl?.verses?.some((verse) => verse.verseNumberToQuran == verseId)) {
    tarteelStore.rememberOpenedVerse()
  }
  router.push({ name: "tarteel", query: { view: "list" } })
}

const clearSearchedWord = () => {
  store.setTarget({
    ...target.value,
    tarteel: "",
  })
  const query = { ...router.currentRoute.value.query }
  delete query.tarteel
  router.replace({ query })
}

const tableQuranIndex = computed(() => dataStore.getQuranIndex)
const target = computed(() => store.getTarget)
const searchedWord = computed(() => target.value?.tarteel || "")
const suraNumber = computed(() => {
  const numberPart = target.value.fileName
    .replace(/[ء-٩]/g, "")
    .replace(/\s/g, "")
  return parseInt(numberPart, 10).toString()
})

const suraKeyValues = computed(
  () => tableQuranIndex.value[suraNumber.value] || tableQuranIndex.value[1],
)

import { useDisplay } from "vuetify"

const display = useDisplay()

const formattedMetrics = computed(() => {
  const allCounts = [
    { value: suraKeyValues.value.numberOfVerses, label: "أية" },
    // { value: suraKeyValues.value.numberOfWords, label: "كلمة" },
    // { value: suraKeyValues.value.numberOfLetters, label: "حرف" },
  ]

  return display.xs.value ? [allCounts[0]] : allCounts
})
</script>

<style scoped></style>
