<template>
  <Table
    :tableData="indexData"
    :tableHeaders="indexHeaders"
    :fieldPlaceHolder="'السور'"
    :activeItemClass="'active-Quran-index'"
    :scrollingContainerClass="'index-container'"
    :activeItemKey="targetedIndex"
    @activateRowItem="handleIndexSelected"
  />
</template>

<script setup>
import { ref, computed, watch, defineProps } from "vue"
import { useQuranStore } from "@/stores/app"
import { useRouter } from "vue-router"
import { useWindowMixin } from "../mixins/windowMixin"
const { scrollToActiveItem } = useWindowMixin()

const router = useRouter()
const store = useQuranStore()

const props = defineProps(["isShowDetail"])

const indexData = computed(() => store.getQuranIndex)
const indexHeaders = ref([
  { title: "رقم", key: "suraIndex", width: 70 },
  { title: "السورة", key: "fileName", width: 100 },
  { title: "الآيات", key: "numberOfVerses", width: 90 },
  { title: "كلمات", key: "numberOfWords", width: 90 },
  { title: "حروف", key: "numberOfLetters", width: 90 },
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

<style scoped>
/* #indexBlock .v-table--fixed-header > .v-table__wrapper {
  overflow-x: hidden !important;
  margin-left: -11px;
} */
</style>
