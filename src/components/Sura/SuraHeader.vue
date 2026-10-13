<template>
  <div class="sura-header d-flex align-center flex-wrap position-relative">
    <div class="sura-title d-flex align-center ga-1">
      <v-btn
        v-if="showSuraNav"
        icon="mdi-chevron-up"
        variant="tonal"
        size="small"
        @click="goToSura(-1)"
      />
      <v-btn
        v-if="showSuraNav"
        icon="mdi-chevron-down"
        variant="tonal"
        size="small"
        @click="goToSura(1)"
      />
      <span class="font-weight-bold text-h5">سورة {{ target.suraName }}</span>
    </div>
    <div
      v-if="searchedWord && !hideControls"
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
        <template #append>
          <v-btn
            icon="mdi-arrow-left"
            size="x-small"
            variant="text"
            @click.stop="openSearchedWord"
          />
        </template>
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
    <div v-if="!hideControls" class="sura-header-input ms-auto">
      <SuraInputField
        :search="search"
        :placeholderText="placeholderText"
        :badgeContent="badgeContent"
        :inputIndex="inputIndex"
        @update:search="emit('update:search', $event)"
        @enter="emit('enter')"
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
  search: String,
  placeholderText: String,
  badgeContent: String,
  inputIndex: [String, Number],
  hideControls: Boolean,
})

const emit = defineEmits([
  "expandedToggle",
  "navigate-up",
  "navigate-down",
  "update:search",
  "enter",
])

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
  tarteelStore.setSelectedTarteelId(match.id)
  tarteelStore.setSelectedRatl(ratl)
  tarteelStore.setSelectedRatlIndex(
    ratl ? match.results.findIndex((item) => item.word === ratl.word) : null,
  )
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
const showSuraNav = computed(
  () => !searchedWord.value || !display.smAndDown.value,
)

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
/* Desktop: input centered in the header, as before */
.sura-header-input {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  max-width: 100%;
}

/* Phone: inline after the chip and navs, shrunk to fit one line */
@media (max-width: 600px) {
  .sura-header-input {
    position: static;
    transform: none;
    width: 220px;
    flex: 1 0 220px;
  }
}
</style>
