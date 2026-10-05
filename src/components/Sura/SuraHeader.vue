<template>
  <div class="sura-header d-flex align-center flex-wrap position-relative">
    <div class="sura-title d-flex align-center ga-1">
      <span class="font-weight-bold text-h5">سورة {{ target.suraName }}</span>
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
    </div>
    <div class="sura-header-tabs">
      <slot />
    </div>
    <div
      v-if="searchedWord"
      class="sura-chip ms-auto d-flex align-center ga-1 flex-row-reverse"
    >
      <v-chip
        closable
        color="primary"
        variant="tonal"
        size="large"
        @click="openSearchedWord"
        @click:close="clearSearchedWord"
      >
        {{ searchedWord }}
      </v-chip>
      <v-btn
        icon="mdi-chevron-up"
        variant="tonal"
        size="small"
        @click="emit('navigate-up')"
      />
      <v-btn
        icon="mdi-chevron-down"
        variant="tonal"
        size="small"
        @click="emit('navigate-down')"
      />
    </div>
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
  title: String,
  showMetaData: Boolean,
  isToolbarExpanded: Boolean,
})

const emit = defineEmits(["expandedToggle", "navigate-up", "navigate-down"])

const toggleToolbar = () => {
  emit("expandedToggle")
}

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

<style scoped>
.sura-header-tabs {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

@media (max-width: 600px) {
  .sura-header-tabs {
    position: fixed;
    inset: auto 0 0;
    transform: none;
    z-index: 4;
    display: flex;
    justify-content: center;
    background: rgb(var(--v-theme-background));
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
