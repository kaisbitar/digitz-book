<template>
  <Table
    :tableType="'verses'"
    v-if="!showMobileView"
    :tableData="verses"
    :tableHeaders="tableVersesHeaders"
    :tableInputText="versesInputText"
    :activeItemClass="'active-verse-table'"
    :scrollingContainerClass="'verses-container'"
    :height="250"
    :activeItemKey="targetedIndex"
    @activateRowItem="handleVerseSelected"
  />
  <TableMobile
    class="table-style-mobile"
    v-if="showMobileView"
    :data="fitleredVeses"
    :headerKeys="tableVersesHeaders"
    :tableInputText="versesInputText"
    :activeItemKey="targetedIndex"
    :activeItemClass="'active-verse-table'"
    :scrollingContainerClass="'verses-container'"
    @activateRowItem="handleVerseSelected"
  />
</template>

<script setup>
import { ref, computed, defineProps } from "vue"
import { useQuranStore } from "@/stores/app"
import { useWindow } from "@/mixins/window"
const { scrollToActiveItem, currentBreakpoint } = useWindow()

const store = useQuranStore()

const props = defineProps(["verses", "isLoading", "versesInputText"])
const emit = defineEmits(["verseSelected"])

const tableVersesHeaders = ref([
  {
    title: "Index",
    key: "index",
  },
  {
    title: "السورة",
    key: "fileName",
    width: "20px",
  },
  {
    title: "رقم",
    key: "verseIndex",
    width: "20px",
  },
  { title: "الآية", key: "verseText", width: "1200px" },
  {
    title: "كلمات",
    key: "numberOfWords",
    width: "20px",
  },
  {
    title: "حروف",
    key: "numberOfLetters",
    width: "20px",
  },
  {
    title: "مصحف",
    key: "verseNumberToQuran",
    width: "20px",
  },
])

const showMobileView = computed(() => store.getVersesMobileView)

const fitleredVeses = computed(() => {
  if (!props.versesInputText) return props.verses
  return props.verses
    .filter((verse) => verse.verseText.includes(props.versesInputText))
    .map((verse, index) => ({
      ...verse,
      index: index,
    }))
})

const targetedIndex = computed(() => {
  return (
    store.getTarget?.verseNumberToQuran ??
    (props.verses.length > 0 ? props.verses[0].verseNumberToQuran : 1)
  )
})
const handleVerseSelected = (item) => {
  if (!item) return
  setTargetedSuraAndVerse(item)
  emit("verseSelected", item)
}

const setTargetedSuraAndVerse = (item) => {
  const suraNumber = item.fileName.replace(/[ء-٩]/g, "").replace(/\s/g, "")
  const suraName = item.fileName.replace(/[0-9]/g, "")
  store.setTarget({
    fileName: `${suraNumber}${suraName}`,
    verseIndex: item.verseIndex,
    verseNumberToQuran: item.verseNumberToQuran,
  })
}
const tableCssTag =
  currentBreakpoint.value === "mobile"
    ? ".verses-container"
    : ".verses-container .v-table__wrapper"

const scrollToActive = () => {
  scrollToActiveItem(".active-verse-table", `${tableCssTag}`)
}

watch(targetedIndex, scrollToActive)

onMounted(scrollToActive)
</script>

<style scoped>
.v-list {
  height: 401px !important;
}
</style>
