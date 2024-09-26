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
    title: "تسلسل",
    key: "index",
    class: "brown lighten-5 black--text",
    width: "50",
  },
  {
    title: "السورة",
    key: "fileName",
    class: "brown lighten-5 black--text",
    width: "110",
    filterable: false,
  },
  {
    title: "رقم",
    key: "verseIndex",
    class: "brown lighten-5 black--text",
  },
  { title: "الآية", key: "verseText", class: "brown lighten-5 black--text" },
  {
    title: "كلمات",
    key: "numberOfWords",
    class: "brown lighten-5 black--text",
  },
  {
    title: "حروف",
    key: "numberOfLetters",
    class: "brown lighten-5 black--text",
  },
  {
    title: "مصحف",
    key: "verseNumberToQuran",
    class: "brown lighten-5 black--text",
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
