<template>
  <div class="sura-header d-flex align-center flex-wrap position-relative">
    <div class="d-flex align-center ga-1">
      <v-btn
        icon="mdi-chevron-up"
        variant="tonal"
        size="small"
        @click="goToSura(-1)"
      />
      <v-btn
        icon="mdi-chevron-down"
        variant="tonal"
        size="small"
        @click="goToSura(1)"
      />
      <span class="font-weight-bold text-h5">سورة {{ target.suraName }}</span>
    </div>
    <div v-if="!hideControls" class="sura-header-input">
      <SuraInputField
        :search="search"
        :placeholderText="placeholderText"
        :badgeContent="badgeContent"
        :inputIndex="inputIndex"
        @update:search="emit('update:search', $event)"
        @enter="emit('enter')"
        @navigate-up="emit('navigate-up')"
        @navigate-down="emit('navigate-down')"
      />
    </div>
    <v-btn
      v-if="searchedWord && !hideControls"
      icon="mdi-arrow-left"
      variant="tonal"
      size="small"
      @click="openSearchedWord"
    />
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
import { processSuraNavigation } from "@/router/utils"

const router = useRouter()
const dataStore = useDataStore()
const store = useStore()
const tarteelStore = useTarteelStore()

const props = defineProps({
  search: String,
  placeholderText: String,
  badgeContent: String,
  inputIndex: [String, Number],
  hideControls: Boolean,
})

const emit = defineEmits([
  "navigate-up",
  "navigate-down",
  "update:search",
  "enter",
])

const goToSura = async (offset) => {
  const next = Number(suraNumber.value) + offset
  if (next < 1 || !tableQuranIndex.value?.[next]) return

  const query = { ...router.currentRoute.value.query }
  await processSuraNavigation({
    params: { suraNumber: next, verseIndex: 1 },
    query,
  })
  router.push({
    name: "sura",
    params: { suraNumber: next, verseIndex: 1 },
    query,
  })
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
  tarteelStore.setSelectedTarteelId(match.id)
  tarteelStore.setSelectedRatl(ratl)
  tarteelStore.setSelectedRatlIndex(
    ratl ? match.results.findIndex((item) => item.word === ratl.word) : null,
  )
  router.push({ name: "tarteel", query: { view: "list" } })
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

<style scoped>
.sura-header-input {
  width: 350px;
  margin-inline-start: auto;
}

/* Phone keeps the back button at the far left, beside the input */
@media (max-width: 600px) {
  .sura-header > .v-btn {
    order: 1;
    margin-inline-start: auto;
  }
  .sura-header-input {
    order: 2;
    margin-inline-start: 0;
  }
}
</style>
