<template>
  <Table
    :tableType="'verses'"
    :tableData="versesWithIndex"
    :tableHeaders="tableVersesHeaders"
    :tableInputText="versesInputText"
    :activeItemClass="'active-verse-table'"
    :scrollingContainerClass="'verses-container'"
    :height="240"
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
    title: "",
    key: "index",
  },
  {
    title: "السورة",
    key: "fileName",
  },
  {
    title: "رقم",
    key: "verseIndex",
  },
  { title: "الآية", key: "verseText" },
  {
    title: "كلمات",
    key: "numberOfWords",
  },
  {
    title: "حروف",
    key: "numberOfLetters",
  },
  {
    title: "مصحف",
    key: "verseNumberToQuran",
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
