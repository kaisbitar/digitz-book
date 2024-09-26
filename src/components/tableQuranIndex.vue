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
      :height="200"
      :activeItemKey="targetedIndex"
      @activateRowItem="handleIndexSelected"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, watch, defineProps } from "vue"
import { useQuranStore } from "@/stores/app"
import { useRouter } from "vue-router"
import { useWindowMixin } from "../mixins/windowMixin"
import { useInputFiltering } from "../mixins/inputFiltering"
const { scrollToActiveItem } = useWindowMixin()
const { updateSearchValue, search } = useInputFiltering()

const router = useRouter()
const store = useQuranStore()

const props = defineProps(["isShowSuraDetail"])

const indexData = computed(() => store.getQuranIndex)
const indexHeaders = ref([
  { title: "رقم", key: "suraIndex", width: 10 },
  { title: "السورة", key: "fileName", width: 70 },
  { title: "الآيات", key: "numberOfVerses", width: 20 },
  { title: "كلمات", key: "numberOfWords", width: 20 },
  { title: "حروف", key: "numberOfLetters", width: 20 },
  { title: "مصحف", key: "verseNumberToQuran", width: 20 },
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
