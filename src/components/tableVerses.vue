<template>
  <Table
    :tableType="'verses'"
    :tableData="versesWithIndex"
    :tableHeaders="tableVersesHeaders"
    :tableInputText="versesInputText"
    :activeItemClass="'active-verse-table'"
    :scrollingContainerClass="'verses-container'"
    :height="340"
    :activeItemKey="targetedIndex"
    :fieldPlaceHolder="versesInputText"
    @activateRowItem="handleVerseSelected"
  />
</template>

<script setup>
import { ref, computed, defineProps } from "vue"
import { useQuranStore } from "@/stores/app"
import { useWindow } from "@/mixins/window"
const { scrollToActiveItem } = useWindow()

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

const versesWithIndex = computed(() => {
  return props.verses.map((verse, index) => ({
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

watch(targetedIndex, () => {
  scrollToActiveItem(
    ".active-verse-table",
    ".verses-container .v-table__wrapper"
  )
})

onMounted(() => {
  scrollToActiveItem(
    ".active-verse-table",
    ".verses-container .v-table__wrapper"
  )
})
</script>
