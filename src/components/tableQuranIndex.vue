<template>
  <v-navigation-drawer
    :model-value="drawerState"
    @update:model-value="updateDrawerState"
    :width="550"
    :location="'left'"
  >
    <v-toolbar dark>
      <div class="sura-index-search mr-3">
        <AppInputField
          variant="outlined"
          bg-color="surface"
          density="compact"
          :modelValue="search"
          fieldPlaceHolder="ابحث عن سورة"
          :dataToShow="indexData.length - 1"
          type="QuranCount"
          @update:modelValue="updateSearchValue"
        />
      </div>
    </v-toolbar>

    <Table
      :isIndexItem="true"
      class="index-container"
      :activeItemClass="'active-index-item'"
      :tableData="indexData"
      :tableInputText="search"
      :tableHeaders="indexHeaders"
      :fieldPlaceHolder="'السور'"
      :activeItemKey="targetedFileName"
      :dimFileNames="matchingSuras"
      :tableHeight="'calc(100vh - 64px - 48px - 8px)'"
      @rowClicked="handleSelectedSura"
    />
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useStore } from "@/stores/appStore"
import { useDataStore } from "@/stores/dataStore"
import { useRouter } from "vue-router"
import { useWindow } from "@/mixins/window"
import { useInputFiltering } from "@/mixins/inputFiltering"
import { useDisplay } from "vuetify"
import { buildVerseObject } from "@/utils/suraUtils"
import { createArabicPattern } from "@/utils/arabicUtils"
import { useTarteelStore } from "@/stores/TarteelStore"
const { scrollToActiveItem } = useWindow()
const { updateSearchValue, search } = useInputFiltering()

const router = useRouter()
const store = useStore()
const dataStore = useDataStore()
const tarteelStore = useTarteelStore()
const display = useDisplay()

const drawerState = computed(() => store.getIndexDrawer)

const updateDrawerState = (value) => {
  store.setIndexDrawer(value)
}

const indexData = computed(() => dataStore.getQuranIndex)
const indexHeaders = ref([
  { title: "رقم", key: "index" }, //Must be called index
  { title: "السورة", key: "suraName" },
  { title: "الآيات", key: "numberOfVerses" },
  { title: "كلمات", key: "numberOfWords" },
  { title: "حروف", key: "numberOfLetters" },
  { title: "مصحف", key: "verseNumberToQuran" },
])
const QuranOneFile = computed(() => dataStore.getOneQuranFile)
const activeRoute = computed(() => router.currentRoute.value.name)
const targetedFileName = computed(() => {
  return store.getTarget.fileName
})

const searchedWord = computed(() => {
  if (activeRoute.value === "sura") return (store.getTarget?.tarteel || "").trim()
  const selected = (tarteelStore.getSelectedTarteel?.inputText || "").trim()
  if (selected) return selected
  return (store.getTarget?.tarteel || "").trim()
})

const matchingSuras = computed(() => {
  const word = searchedWord.value
  if (!word) return null
  const verses = QuranOneFile.value
  if (!verses?.length) return null

  const regex = createArabicPattern(word)
  const names = new Set()
  for (const verse of verses) {
    if (!regex.test(verse.verseText)) continue
    names.add(verse.fileName)
  }
  return names
})

const isMobile = computed(() => {
  return display.mobile.value
})

const verseForSura = (fileName) => {
  const verses = (QuranOneFile.value || []).filter(
    (item) => item.fileName === fileName,
  )
  if (!verses.length) return null

  const first = verses.find((item) => item.verseIndex === 1) || verses[0]
  const word = searchedWord.value
  if (!word) return first

  const regex = createArabicPattern(word)
  return verses.find((item) => regex.test(item.verseText)) || first
}

const handleSelectedSura = async (sura) => {
  if (isMobile.value) store.setIndexDrawer(false)
  if (sura.fileName === "000المصحف") {
    store.setTarget({ fileName: "000المصحف" })
    if (activeRoute.value !== "sura") router.push({ name: "sura" })
    return
  }

  const verse = verseForSura(sura.fileName)
  if (!verse) return

  store.setActiveSuraTab("suraText")
  const word = searchedWord.value
  store.setTarget({
    ...buildVerseObject(verse),
    tarteel: word || store.getTarget?.tarteel || "",
  })

  const query = { ...router.currentRoute.value.query }
  if (word) query.tarteel = word
  await router.push({
    name: "sura",
    params: {
      suraNumber: String(verse.fileName).replace(/[ء-٩]/g, "").replace(/\s/g, ""),
      verseIndex: verse.verseIndex,
    },
    query,
  })

  scrollToActiveItem(".active-verse-text", ".sura-text-container")
}

watch(targetedFileName, () => {
  scrollToActiveItem(`.active-index-item`, `.index-container .v-table__wrapper`)
})

onMounted(() => {
  scrollToActiveItem(".active-index-item", ".index-container .v-table__wrapper")
})
</script>

<style>
.index-container .v-table__wrapper {
  overflow-x: hidden !important;
}

.sura-index-search {
  width: calc(100% / 1.618);
  flex-shrink: 0;
}

.sura-index-search .v-input__control {
  flex-grow: 1;
}

.sura-index-search .v-input__append {
  display: none;
}

.sura-index-search .v-field {
  font-size: 0.875rem;
}
</style>
