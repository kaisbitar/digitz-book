<template>
  <v-container>
    <AppInputField
      :fieldInput="search"
      :fieldPlaceHolder="'السور'"
      @update:fieldInput="updateSearchValue"
    />
    <Table
      :tableData="indexData"
      :tableInputText="search"
      :tableHeaders="indexHeaders"
      :fieldPlaceHolder="'السور'"
      :activeItemClass="'active-Quran-index'"
      :scrollingContainerClass="'index-container'"
      :height="135"
      :activeItemKey="targetedIndex"
      @activateRowItem="handleIndexSelected"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useQuranStore } from "@/stores/app"
import { useRouter } from "vue-router"
import { useWindow } from "@/mixins/window"
import { useInputFiltering } from "@/mixins/inputFiltering"
const { scrollToActiveItem, currentBreakpoint } = useWindow()
const { updateSearchValue, search } = useInputFiltering()

const router = useRouter()
const store = useQuranStore()

const props = defineProps(["isShowSuraDetail"])

const indexData = computed(() => store.getQuranIndex)
const indexHeaders = ref([
  { title: "رقم", key: "index" }, //Must be called index
  { title: "السورة", key: "fileName" },
  { title: "الآيات", key: "numberOfVerses" },
  { title: "كلمات", key: "numberOfWords" },
  { title: "حروف", key: "numberOfLetters" },
  { title: "مصحف", key: "verseNumberToQuran", width: 2000 },
])
const targetedIndex = computed(() => {
  return store.getTarget.fileName
})

const handleIndexSelected = (sura) => {
  store.setTarget({
    fileName: sura.fileName,
    verseIndex: 1,
    verseNumberToQuran: sura.verseNumberToQuran.toString(),
  })
  if (currentBreakpoint.value === "mobile") {
    store.setDrawerState(false)
  }
  if (router.currentRoute.value.name !== "sura") {
    router.push({ name: "sura" })
  }

  store.setSearchIndex(-1)
}

watch(targetedIndex, () => {
  scrollToActiveItem(
    `.active-Quran-index`,
    `.index-container .v-table__wrapper`
  )
})

onMounted(() => {
  scrollToActiveItem(
    ".active-Quran-index",
    ".index-container .v-table__wrapper"
  )
})
</script>

<style scoped></style>
